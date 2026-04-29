import Anthropic from '@anthropic-ai/sdk';
import { toolDefinitions, isWriteOperation, executeTool, describePendingAction } from './tools.js';
import { getUser } from './state.js';

let client = null;
function getClient() {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}
function buildSystemPrompt(userId) {
  const user = getUser(userId);
  const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai', dateStyle: 'full', timeStyle: 'short' });
  return `You are a helpful, professional voice banking assistant for a premium UAE bank. You are currently serving ${user.name} (${user.nameAr}).

Current date and time (Dubai): ${now}

CRITICAL RULES:
1. LANGUAGE: Always respond in the SAME language the user spoke. If they spoke Arabic, respond entirely in Arabic. If English, respond in English. Never mix languages unless quoting account names.
2. BREVITY: Keep responses concise and conversational — this is a voice assistant. 1-3 sentences max.
3. CURRENCY FORMATTING: Always format numbers with proper currency symbols and commas.
4. SECURITY: Tools marked as WRITE operations require user confirmation. When you need to call a write tool, do so normally — the system will handle the confirmation flow.
5. TONE: Professional yet warm. Use the user's name occasionally.
6. ACCOUNTS: The user has the following accounts — use the correct account IDs when calling tools:
${user.accounts.map(a => `   - ${a.name} (ID: ${a.id}): ${a.currency} ${a.balance.toLocaleString()}`).join('\n')}
7. When the user asks about "my balance" without specifying, show ALL accounts.
8. For currency conversions, identify the correct source and destination account IDs based on the currencies mentioned.`;
}

export async function handleChat(userId, messages, pendingAction) {
  // If there's a confirmed pending action, execute it first
  if (pendingAction && pendingAction.confirmed) {
    const result = executeTool(userId, pendingAction.toolName, pendingAction.toolInput);

    // Build the tool result and get Claude's final response
    const toolUseId = pendingAction.toolUseId || 'confirmed_action';
    const augmentedMessages = [
      ...messages,
      {
        role: 'assistant',
        content: pendingAction.assistantText 
          ? [
              { type: 'text', text: pendingAction.assistantText },
              { type: 'tool_use', id: toolUseId, name: pendingAction.toolName, input: pendingAction.toolInput },
            ]
          : [
              { type: 'tool_use', id: toolUseId, name: pendingAction.toolName, input: pendingAction.toolInput },
            ],
      },
      {
        role: 'user',
        content: [
          { type: 'tool_result', tool_use_id: toolUseId, content: JSON.stringify(result) },
        ],
      },
    ];

    const response = await getClient().messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1024,
      system: buildSystemPrompt(userId),
      tools: toolDefinitions,
      messages: augmentedMessages,
    });

    const textBlocks = response.content.filter(b => b.type === 'text');
    const text = textBlocks.map(b => b.text).join('\n');
    return { response: text, toolResult: result };
  }

  // Normal chat flow with tool-use loop
  let currentMessages = [...messages];
  const systemPrompt = buildSystemPrompt(userId);
  let iterations = 0;
  const maxIterations = 5;

  while (iterations < maxIterations) {
    iterations++;

    const response = await getClient().messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1024,
      system: systemPrompt,
      tools: toolDefinitions,
      messages: currentMessages,
    });

    // Check if the model wants to use a tool
    const toolUseBlocks = response.content.filter(b => b.type === 'tool_use');
    const textBlocks = response.content.filter(b => b.type === 'text');
    const assistantText = textBlocks.map(b => b.text).join('\n');

    if (toolUseBlocks.length === 0 || response.stop_reason === 'end_turn') {
      // No tool call — return the text response
      return { response: assistantText };
    }

    // Process each tool call
    for (const toolUse of toolUseBlocks) {
      if (isWriteOperation(toolUse.name)) {
        // Write operation — return pending action for user confirmation
        const description = describePendingAction(toolUse.name, toolUse.input, userId);
        return {
          response: assistantText,
          pendingAction: {
            toolName: toolUse.name,
            toolInput: toolUse.input,
            toolUseId: toolUse.id,
            assistantText,
            ...description,
          },
        };
      }

      // Read operation — execute immediately
      const result = executeTool(userId, toolUse.name, toolUse.input);

      // Add the assistant's response and tool result to the conversation
      currentMessages = [
        ...currentMessages,
        { role: 'assistant', content: response.content },
        {
          role: 'user',
          content: [
            { type: 'tool_result', tool_use_id: toolUse.id, content: JSON.stringify(result) },
          ],
        },
      ];
    }
  }

  return { response: 'I apologize, but I was unable to complete your request. Please try again.' };
}
