# Planning Prompt

Generate a daily execution plan from the Brutal 3.

## Input
- brutal_three array
- current time
- user timezone

## Output
- Sequenced order (what to do first/second/third)
- Transition prompts between tasks
- Total estimated time

## Rules
- Shortest task first if energy is low
- Hardest task first if energy is high
- Always include first_step for immediate action
