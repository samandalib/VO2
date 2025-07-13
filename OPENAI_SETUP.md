# OpenAI Assistant Integration Setup

Your VO2Max app is now configured to use your specific OpenAI Assistant to generate personalized fitness plans. Follow these steps to complete the setup:

## 1. Get OpenAI API Key

1. Go to [OpenAI's website](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to the API section
4. Create a new API key
5. Copy the API key (starts with `sk-`)

## 2. Get Your Assistant ID

1. In the OpenAI platform, go to the **Assistants** section
2. Find your VO2Max fitness assistant
3. Copy the Assistant ID (starts with `asst_`)
4. Make sure your assistant is properly configured with:
   - Instructions for fitness expertise
   - Configured to return JSON responses
   - Appropriate model selection (GPT-4 recommended)

## 3. Set Environment Variables

### For Development (Local)

Create a `.env` file in your project root and add:

```bash
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_ASSISTANT_ID=asst_your_assistant_id_here
```

### For Production (Deployment)

Set both environment variables in your hosting platform:

- **Netlify**: Go to Site settings → Environment variables
  - Add `OPENAI_API_KEY` with your API key
  - Add `OPENAI_ASSISTANT_ID` with your assistant ID
- **Vercel**: Go to Project settings → Environment Variables
  - Add both `OPENAI_API_KEY` and `OPENAI_ASSISTANT_ID`
- **Railway**: Go to Variables tab in your project
  - Add both environment variables
- **Docker**: Use `-e OPENAI_API_KEY=your_key -e OPENAI_ASSISTANT_ID=your_id` or docker-compose environment

## 4. Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to your app
3. Fill out the VO2Max assessment form
4. Click "Get My Improvement Plans"
5. The app will now call your specific OpenAI Assistant

## 5. API Usage & Costs

- **API Used**: OpenAI Assistants API with your custom assistant
- **Estimated Cost**: ~$0.10-0.30 per plan generation (depends on your assistant's model)
- **Rate Limits**: Standard OpenAI API rate limits apply
- **Timeout**: 60 seconds maximum per request

## 6. Assistant Configuration Tips

For optimal results, configure your OpenAI Assistant with:

### Instructions Example:

```
You are a certified exercise physiologist and fitness expert specializing in VO2Max improvement.

When asked to create fitness plans, always respond with exactly 3 plans (Beginner, Intermediate, Advanced) in valid JSON format.

Use evidence-based training methods and provide specific, actionable guidance. Include research backing for your recommendations.

Always format responses as a JSON array with these exact fields for each plan:
- level: "Beginner", "Intermediate", or "Advanced"
- trainingProtocol: Detailed weekly structure
- reason: Why this suits the person's metrics
- timeCommitment: Weekly hours/sessions
- resultsTimeframe: When to expect results
- realisticProgress: Specific improvement expectations
- researchPopulation: Study population
- researchResults: Research findings
- recommended: boolean (true for best match)
```

### Model Selection:

- **GPT-4**: Best quality (recommended)
- **GPT-3.5-turbo**: Lower cost option

### Files/Knowledge:

- Upload research papers on VO2Max training
- Add exercise physiology reference materials
- Include training methodology documents

## 7. Error Handling

The app handles common errors:

- Missing or invalid API key
- Missing or invalid Assistant ID
- Assistant run failures or timeouts
- Rate limit exceeded
- Invalid JSON responses from assistant
- Network connectivity issues

## 8. Troubleshooting

### Common Issues:

**"Assistant ID not configured"**

- Verify `OPENAI_ASSISTANT_ID` is set correctly
- Check that the Assistant ID starts with `asst_`

**"Invalid JSON response"**

- Update your Assistant's instructions to ensure JSON output
- Test your Assistant in the OpenAI platform first

**"Assistant run timed out"**

- Your Assistant might be overloaded
- Try again or check OpenAI status

**"Assistant run failed"**

- Check your Assistant's configuration
- Verify it has proper instructions and model access

### Testing Your Assistant:

1. Go to the OpenAI Assistants playground
2. Send a test message similar to what the app sends
3. Verify it returns properly formatted JSON
4. Make sure the response includes all required fields

## 9. Security Notes

- API key and Assistant ID are kept server-side only
- User data is sent to your OpenAI Assistant for plan generation
- Each request creates a new thread (stateless)
- Consider adding user consent for AI processing
- Review OpenAI's data usage policies

## 10. Advanced Customization

### Modify the User Prompt:

Edit `server/routes/generate-plans.ts` to change:

- What user data is sent to your Assistant
- The format requirements
- Additional context or constraints

### Assistant Capabilities:

Your Assistant can use:

- File search through uploaded documents
- Function calling for external APIs
- Code interpreter for calculations
- Custom knowledge from uploaded files

## Need Help?

- Check the browser console for detailed error messages
- Verify your API key has sufficient credits
- Test your Assistant in the OpenAI platform first
- Ensure your Assistant is configured to return JSON
- Check server logs for detailed error information
- Verify both environment variables are properly set

Your Assistant should now generate personalized VO2Max improvement plans based on your specific expertise and training!
