# Generate Alternatives Script

This script generates the `alternatives.json` file from the database for use in the prerequisite graph feature.

## Usage

From the backend directory, run:

```bash
npm run generate-alternatives
```

## What it does

1. Fetches all courses from the database
2. Fetches all prerequisite relationships
3. Groups prerequisites by course
4. Generates alternative prerequisite paths
5. Writes the output to `frontend/src/app/pages/alternatives.json`

## Output Format

The generated JSON has the following structure:

```json
{
  "courseAlternatives": {
    "CMPT214": {
      "alternatives": [
        ["CMPT145"],
        ["CMPT115"]
      ],
      "description": "CMPT145 OR CMPT115"
    },
    "CMPT111": {
      "alternatives": [[]],
      "description": "No prerequisites"
    }
  }
}
```

## Current Limitations

- Treats all multiple prerequisites as OR alternatives (e.g., CMPT145 OR CMPT115)
- Does not handle complex AND/OR combinations (e.g., "CMPT280 AND STAT245")
- Each prerequisite becomes its own alternative group

## Future Enhancements

To support complex prerequisite logic (AND/OR combinations), you would need to:

1. Add a prerequisite logic field to the database
2. Parse the logic to create proper alternative groups
3. Update the script to handle these combinations

For example:
- `(CMPT280 AND STAT245) OR (CMPT215 AND STAT245)` would become:
  ```json
  "alternatives": [
    ["CMPT280", "STAT245"],
    ["CMPT215", "STAT245"]
  ]
  ```
