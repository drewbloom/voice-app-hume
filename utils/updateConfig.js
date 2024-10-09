import "server-only";
import getCaseByTitle from '../utils/getCaseByTitle';

export default async function updateConfig(caseTitle) {
    const api_key = String(process.env.HUME_API_KEY);
    const configId = String(process.env.TEST_CONFIG);
    const initialHistoryPromptId = String(process.env.INITIAL_HISTORY_PROMPT);
    let updatedConfigVersion = 1000;
    let updatedPromptVersionId = 1000;
    const caseData = getCaseByTitle(caseTitle);
    const caseDataString = caseData ? JSON.stringify(caseData, null, 2) : "Case not found";
    const initialHistoryMessage = `<use_data>\n<interaction_data>\n
        Your role is to act as the patient for the student to practice taking an initial history. 
        Here is the data for the scenario and your identity:\n\n
        ${caseDataString}\n\n
        <enter_conversation_mode>\n
        The student will now begin speaking with you.
        Take a deep breath and remember your instructions to provide an excellent practice experience.`;
    
    // the steps below are AI generated based on instructions & API documentation from Hume (see at bottom)
    try {
        // Step 1: Get the current prompt text
        const promptResponse = await fetch(`https://api.hume.ai/v0/evi/prompts/${initialHistoryPromptId}/version/0`, {
            method: 'GET',
            headers: {
                'X-Hume-Api-Key': api_key
            }
        });

        if (!promptResponse.ok) {
            throw new Error(`Failed to fetch the current prompt: ${promptResponse.statusText}`);
        }

        const promptData = await promptResponse.json();
        const currentPromptText = promptData.text;

        // Step 2: Create a new prompt version
        const updatedPrompt = `${currentPromptText}${initialHistoryMessage}`;
        const newPromptVersionResponse = await fetch(`https://api.hume.ai/v0/evi/prompts/${initialHistoryPromptId}`, {
            method: 'POST',
            headers: {
                'X-Hume-Api-Key': api_key,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: updatedPrompt,
                version_description: "Temporary prompt instance created for case data and interaction type use"
            })
        });

        if (!newPromptVersionResponse.ok) {
            throw new Error(`Failed to create a new prompt version: ${newPromptVersionResponse.statusText}`);
        }

        const newPromptVersionData = await newPromptVersionResponse.json();
        updatedPromptVersionId = newPromptVersionData.version;

        // Step 3: Create a new configuration version
        const newConfigResponse = await fetch(`https://api.hume.ai/v0/evi/configs/${configId}`, {
            method: 'POST',
            headers: {
                'X-Hume-Api-Key': api_key,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                evi_version: "2",
                version_description: `Temporary config instance created for ${caseTitle} and interaction Type: Initial History.`,
                prompt: {
                    id: initialHistoryPromptId,
                    version: updatedPromptVersionId
                },
                voice: {
                    provider: "HUME_AI",
                    custom_voice: {
                        name: "FRANK AIKEN",
                        base_voice: "ITO",
                        parameter_model: "20240715-4parameter",
                        parameters: {
                            gender: -100,
                            huskiness: 100,
                            nasality: 73,
                            pitch: -100
                        }
                    }
                },
                language_model: {
                    model_provider: "OPEN_AI",
                    model_resource: "gpt-40-mini",
                    temperature: 1
                },
                ellm_model: {
                    allow_short_responses: true
                },
                timeouts: {
                    inactivity: {
                        enabled: true,
                        duration_secs: 15
                    },
                    max_duration: {
                        enabled: true,
                        duration_secs: 450
                    }
                }
            })
        });

        if (!newConfigResponse.ok) {
            throw new Error(`Failed to create a new configuration version: ${newConfigResponse.statusText}`);
        }

        const newConfigData = await newConfigResponse.json();
        updatedConfigVersion = newConfigData.version;

    } catch (error) {
        console.error('Error updating configuration:', error);
        throw error; // Rethrow the error to prevent further execution
    }

    // Finally, return the updated configuration and prompt version numbers
    return [updatedConfigVersion, updatedPromptVersionId];
}


       // Add logic that will update the prompt, config, and store
        // version numbers as it works. Needs to return updated config
        // version number to main Chat component, but also needs
        // to allow for deletion of created prompts / configs
        // by version number and store the prompt & config ids

        // 1. Get prompt text
        // 2. Make new prompt version
        // 3. Update config version with new prompt version
        // 4. Pass new config version back via variable for Chat to use

        // const defaultInitialHistoryPromptId = String(process.env.INITIAL_HISTORY_PROMPT);

        // Make curl request to get this prompt, return the text contents:
        // GET - curl https://api.hume.ai/v0/evi/prompts/${defaultInitialHistoryPromptId}/version/0
        // Header: "X-Hume-Api-Key: ${api_key}"
    
        /* It returns an object like this, we want to extract the "text" value
            {
            "id": "af699d45-2985-42cc-91b9-af9e5da3bac5",
            "version": 0,
            "version_type": "FIXED",
            "version_description": "",
            "name": "Weather Assistant Prompt",
            "created_on": 1722633247488,
            "modified_on": 1722633247488,
            "text": "<role>You are an AI weather assistant providing users with accurate and up-to-date weather information. Respond to user queries concisely and clearly. Use simple language and avoid technical jargon. Provide temperature, precipitation, wind conditions, and any weather alerts. Include helpful tips if severe weather is expected.</role>"
            }
        */
    
        // Next, append our initialHistoryMessage to the end of the prompt and create a new version for this updatedPrompt
        // Logic to concatenate the "text" value string with initialHistoryMessage into updatedPrompt
        // POST - curl -X POST https://api.hume.ai/v0/evi/prompts/${defaultInitialHistoryPromptId}
        // -H "X-Hume-Api-Key: ${api_key}"
        // -H "Content-Type: application/json"
        /* -d '{
            "text": updatedPrompt
            "version_description": "Temporary prompt instance created for case data and interaction type use"
        }' */
        // This will return an object with a key "version": value - number
        // Store the number value in a variable updatedPromptVersionId
    
        // Next, create a new config that utilizes our updated prompt version
        // POST - curl -X POST https://api.hume.ai/v0/evi/configs/${configId}
        // -H "X-Hume-Api-Key: ${api_key}"
        // -H "Content-Type: application/json"
        /* -d '{
            "evi_version": "2",
            "version_description": "Temporary config instance created for ${caseTitle} and interaction Type: Initial History.",
            "prompt": {
                "id": defaultInitialHistoryPromptId,
                "version": updatedPromptVersionId
            },
            "voice": {
                "provider": "HUME_AI",
                "custom_voice": {
                    "name": "FRANK AIKEN",
                    "base_voice": "ITO",
                    "parameter_model": "20240715-4parameter",
                    "parameters": {
                        "gender": -100,
                        "huskiness": 100,
                        "nasality": 73,
                        "pitch": -100
                    }
                }
            },
            "language_model": {
                "model_provider": "OPEN_AI",
                "model_resource": "gpt-40-mini",
                "temperature": 1
            },
            "ellm_model": {
                "allow_short_responses": true
            },
            "timeouts": {
                "inactivity": {
                    "enabled": true,
                    "duration_secs": 15
                },
                "max_duration": {
                    "enabled": true,
                    "duration_secs": 450
                }
            }
    
        }'
        */
    
        // This will return a config object with a key "version" holding a number value
        /* Sample:
            {
            "id": "1b60e1a0-cc59-424a-8d2c-189d354db3f3",
            "version": 1,
            "version_description": "This is an updated version of the Weather Assistant Config.",
            "name": "Weather Assistant Config",
            "created_on": 1715275452390,
            "modified_on": 1722642242998,
            "evi_version": "2",
            "prompt": {
                // continues from here to list all properties
        */
       // Extract version number and store it in variable updatedConfigVersion
    
        // Need to store the updatedPromptVersionId and the updatedConfigVersion so we can delete these after the chat is complete
        // Need to write logic for a deleteTemporaryVersions method to run after Chat finishes -
        // For now, return these with updatedConfigVersion and use them at the end of chat as args for deleteTemporaryVersions
    
       // Finally, return updatedConfigVersion