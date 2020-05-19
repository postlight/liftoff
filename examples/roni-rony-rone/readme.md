### To see how Liftoff works, follow these steps to launch this example

1. `cd ./examples/roni-rony-rone`
2. If you haven't already yet, create an [airtable account](https://airtable.com/signup)
3. Copy our airtable [here](https://airtable.com/shrPGjHpuY6ymFrEI/tblD67h7H7u2zbthH/viw54wUiBaVqVbG1V)
4. On the [Airtable account page](https://airtable.com/account), generate and then copy your API key. You'll need this in order to pull the data from the table you copied over.
5. Now that you have your own airtable base, get the following values from Airtable: `BASE_ID`, `TABLE_ID`, and `VIEW_ID`. Copy them over into the appropriate places in the `.env.example` file.
6. rename the env file `$ mv .env.example .env`.
7. Run it with `yarn start:dev`!
8. Edit the values in your airtable and refresh the browser to see your changes!
