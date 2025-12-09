# Troubleshooting OpenAI API Key Issues

If your OpenAI API key is configured but still not working, follow these steps:

## Step 1: Verify the API Key is Loaded

1. **Restart your development server** after adding the API key:
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

2. **Test if the key is loaded** by visiting:
   ```
   http://localhost:3000/api/test-openai
   ```
   
   This will tell you if:
   - The key is found in environment variables
   - The key is valid
   - There are any connection issues

## Step 2: Check Common Issues

### Issue: Server Not Restarted
**Solution**: Environment variables are only loaded when the server starts. You MUST restart after adding/changing `.env.local`.

### Issue: Wrong File Name
**Solution**: Make sure the file is named exactly `.env.local` (not `.env`, `.env.local.txt`, etc.)

### Issue: Wrong Variable Name
**Solution**: The variable must be exactly `OPENAI_API_KEY` (case-sensitive, no spaces)

### Issue: Key Has Line Breaks
**Solution**: The entire key must be on a single line:
```env
OPENAI_API_KEY=sk-proj-...your-entire-key-here...
```

### Issue: Invalid API Key
**Solution**: 
- Verify the key at https://platform.openai.com/api-keys
- Make sure you copied the entire key
- Check if the key has been revoked or expired

### Issue: No Credits/Balance
**Solution**: 
- Check your OpenAI account balance at https://platform.openai.com/account/billing
- Add payment method if needed
- DALL-E requires credits to generate images

## Step 3: Check Browser Console

Open your browser's developer console (F12) and look for:
- Error messages from the API
- Network requests to `/api/generate-image`
- Response status codes and error details

## Step 4: Check Server Logs

Look at your terminal where `npm run dev` is running for:
- Error messages
- API request logs
- Environment variable status

## Step 5: Test the API Directly

You can test if your key works by making a direct API call:

```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY_HERE"
```

If this works, the key is valid. If not, check the error message.

## Common Error Messages

### "OpenAI API key not configured"
- The key is not in `.env.local`
- The server wasn't restarted
- Wrong variable name

### "Invalid API Key" (401)
- The key is incorrect
- The key has been revoked
- There are extra spaces or characters

### "Insufficient quota" (402) or "Rate limit exceeded" (429)
- No credits in your OpenAI account
- Rate limit reached
- Add payment method

### "Failed to generate image"
- Check the `details` field in the error for more info
- Could be content policy violation
- Could be invalid prompt format

## Still Not Working?

1. **Verify the key format**:
   ```env
   OPENAI_API_KEY=sk-proj-...  # No quotes, no spaces around =
   ```

2. **Check for hidden characters**:
   - Make sure there are no trailing spaces
   - No line breaks in the middle of the key
   - No special characters that shouldn't be there

3. **Try a fresh key**:
   - Generate a new API key at https://platform.openai.com/api-keys
   - Delete the old one from `.env.local`
   - Add the new one
   - Restart the server

4. **Check Next.js version**:
   - Make sure you're using Next.js 13+ (App Router)
   - Environment variables work differently in Pages Router

## Getting Help

If none of these work:
1. Check the browser console for detailed error messages
2. Check the server terminal for logs
3. Visit `/api/test-openai` to see diagnostic information
4. Share the error message (but NOT your API key!)

