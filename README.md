# Financial Planner Application

### Tech Stack

* AWS
  * EventBridge
  * EC2
  * Lambda
  * CloudWatch
  * API Gateway
* Serverless
* TypeScript
* GraphQL
* Zod
* React
* MaterialUI
* Formik
* Apollo
* PostgreSQL
* TypeORM

### Core Functionality 

1. Monthly expense tracker
   * Two flows
     * Prompts
     * Enter income, disposable income, monthly expenses
       * Basic (only enter income, estimated disposable, estimated monthly)
       * In Depth (enter a breakdown for each field the prompts provide)
   * Prompts for common fixed expenses
     * Rent
     * Utilities
     * Internet
     * Insurance
     * Gym Membership
     * Other
   * Prompts for fluctuating monthly expenses
     * Food prompt with estimated options
       * Low cost (conservative food choices, no dietary restrictions, 1-3 times a month eating out)
       * Moderate cost (4-6 times a month takeout, average diet, no dietary requirements i.e. high protein, vegan, etc
       * High cost (frequent takeout, dietary requirements i.e. high protein, vegan, etc)
     * How much do you want to set aside for hobbies, events, etc?
     * How much do you spend on clothing?
     * How much do you spend on personal hygiene and makeup
2. Goal tracker
   * How aggressively do you want to pursue this goal?
     * Based on disposable income, 4 different levels
     * Goal length (weeks, months, years)
     * Tracks where you should be at
     * Has an optional field for where you are actually at