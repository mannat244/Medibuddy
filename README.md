# Medibuddy

Medibuddy is a simple medicine label search application. It uses the openFDA Drug Label API to help users search for a brand name, compare matching labels, and read details for one selected record.

It is not an AI application and it does not provide medical advice. The data comes from US FDA labels and may not match medicine availability or regulations in India.

## What It Does

- Searches medicines by brand name.
- Shows suggestions while the user types.
- Displays matching labels in responsive cards.
- Shows brand, purpose, manufacturer, ingredients, route, and product type.
- Opens a details page for a selected FDA record.
- Shows dosage, uses, warnings, precautions, pregnancy information, and label metadata.
- Handles loading, empty, error, and missing-record states.

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other available commands:

```bash
npm run lint
npm run build
npm run start
```

## API

Search requests use:

```text
https://api.fda.gov/drug/label.json?search=openfda.brand_name:"QUERY"&limit=20
```

Medicine details use the selected FDA record ID:

```text
/medicine?id=FDA_RECORD_ID
```

## Performance Choices

- **Debouncing:** Suggestions wait 400 ms after the user stops typing, so the app does not send a request for every keystroke.
- **Suggestion cache:** Suggestions already fetched during the current session are reused from an in-memory `Map`.
- **Result cache:** Search results are stored in `localStorage` for five minutes and validated before reuse.
- **Request cancellation:** `AbortController` cancels older suggestion, search-result, and detail requests when they are no longer relevant.
- **Stale response protection:** A response from an older request cannot replace newer results.
- **Memoization:** `useMemo` is used in `app/search/page.js` for the API URL and local-storage cache key. These values are dependencies of the results-fetching effect and are reused together. It is not used for simple display values where it would add unnecessary complexity.

## Data Notice

openFDA advises users not to rely on the API alone for medical-care decisions. Always read the product label and consult a doctor or pharmacist when needed.

## Loading and Error States

Medibuddy uses UI skeletons while API requests are in progress. Skeletons show the expected shape of the content, make waiting feel clearer, prevent layout shifts, and keep the page structure stable.

Skeletons are used for:

- Medicine suggestions while the debounced request is running.
- Result cards while search results are loading.
- Medicine details while the selected FDA record is loading.

The FDA API returns `404` when no label matches a search. This is treated as an expected no-match response, not an application crash:

- Suggestions show `Could not get suggestions. Try a similar name.`
- The results page shows `No results found.`
- The details page shows an error state if the selected record cannot be found.

## Future Improvements

With more time, I would consider the following improvements:

- Use an indexed database to cache FDA responses. This would provide more durable and scalable caching than browser storage alone.
- Move API calls into Next.js route handlers so the application controls the API boundary and response handling.
- Use Incremental Static Regeneration where appropriate for medicine records that can be safely cached and revalidated.
- Spend more time on interaction design and UX testing, especially around search suggestions, loading transitions, result comparison, and detail-page navigation.
- Refine the component structure further by separating the home hero text and search form into a dedicated `Hero` component, while keeping `Search` focused on input, suggestions, and routing.
