# Nestle AI Chatbot Technical Assessment

## Requisites

To run locally, you need the following

**1. OpenAI API account with funds**

**2. Database with table `scraped_data` and columns `id`, `url` and `text_content`**

## Install from source

**1. Clone the repository to a directory on your PC:**

```
git clone https://github.com/Jerrykinss/nestle-assessment
```

**2. Open the folder:**

```
cd nestle-assessment
```

**3. Rename the `.example.env` to `.env` and populate with your own OpenAI API key and database connection variables:**

```
mv .example.env .env
```

**5. Install dependencies:**

```
npm install
```

**6. Run web scraper:**

```
node --loader ts-node/esm scraper/scraper.ts
```

**7. Start the development server:**

```
npm run dev
```

**8. Go to [localhost:3000](http://localhost:3000) to use**

# Tech stack

[NextJS](https://nextjs.org/) - React Framework for the Web

[TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework

[OpenAI API](https://platform.openai.com/) - API for interaction with LLM (gpt-4o-mini)

# Prompts

[System Prompt](src/app/api/chat/route.ts)

[Content Retrieval Prompt](src/app/page.tsx)

# Limitations

The AI only retrieves the contents of one page at a time. This is chosen from a list of URLs of all available pages. Since the chatbot cannot know the page contents beforehand, it may choose to view the wrong URL, or realize after that the page does not contain the information it needs. However, the chatbot is configured such that if this situation occurs, it can ask the user for permission to search another webpage for required information.