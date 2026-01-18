# LifeContext Integration with Project Generator

**Version:** 1.0.0
**Last Updated:** January 18, 2026
**Related:** `/Users/daniel/Desktop/agent-prompts/PROJECT_GENERATOR_PROMPT.md`

---

## Overview

LifeContext can export **Context Packets** to the **Project Generator** system, providing the "why" behind a project - your motivations, frustrations, insights, and background that inform what you're building.

This integration enables a powerful workflow:
1. **Brain dump your project ideas in LifeContext** (voice or text)
2. **AI synthesizes themes and insights**
3. **Export Context Packet to Project Generator**
4. **Generate prompts enriched with personal context**

---

## Why This Matters

When building software, the "why" is as important as the "what":

| Without LifeContext | With LifeContext |
|---------------------|------------------|
| Generic problem statement | Personal pain points driving the solution |
| Assumed user needs | Real frustrations from experience |
| Standard differentiators | Insights from past tool usage |
| Template-driven research | Focused research on actual gaps |

LifeContext captures the **emotional and experiential context** that makes your project unique.

---

## Export Format

### Context Packet

LifeContext exports a **Context Packet** - an AI-synthesized summary of relevant thoughts and insights.

**Export Location:** Brain Dump → Synthesis → Export Context Packet

```json
{
  "contextPacket": {
    "version": "1.0",
    "generatedAt": "2026-01-18T12:00:00Z",
    "subject": "New Code Review Tool Idea",
    "summary": "User is frustrated with existing AI code review tools, particularly CodeRabbit's rate limits and lack of self-hosting options. They have experience running engineering teams and understand the security concerns enterprises face. Vision is for an open-source, self-hostable alternative with cost transparency.",

    "themes": [
      {
        "name": "Frustration with existing tools",
        "excerpts": [
          "CodeRabbit keeps hitting rate limits on our monorepo",
          "We can't use cloud tools because of SOC2 compliance",
          "I never know how much a review will cost until after"
        ],
        "sentiment": "negative"
      },
      {
        "name": "Security and compliance concerns",
        "excerpts": [
          "Our legal team won't approve any tool that sends code to third parties",
          "We need something we can run in our own VPC"
        ],
        "sentiment": "neutral"
      },
      {
        "name": "Vision for solution",
        "excerpts": [
          "What if you could bring your own API key?",
          "Self-hosted but still easy to set up",
          "Show the cost before running the review"
        ],
        "sentiment": "positive"
      }
    ],

    "keyInsights": [
      "User's enterprise background informs the self-hosting requirement",
      "Cost transparency is tied to past surprise bills from AI services",
      "Monorepo support is a specific pain point from current work",
      "User values open source for auditability and trust"
    ],

    "contradictions": [
      "User wants 'simple setup' but also 'enterprise features' - may need tiered approach"
    ],

    "clarifyingQuestions": [
      "Would you prioritize GitHub support over GitLab initially?",
      "Is real-time review more important than batch processing?",
      "What's the acceptable review latency for your team?"
    ],

    "relatedEntries": [
      {
        "date": "2025-11-20",
        "type": "brain_dump",
        "title": "Thoughts on developer tools market",
        "relevance": 0.82
      },
      {
        "date": "2025-12-05",
        "type": "brain_dump",
        "title": "Enterprise security requirements learnings",
        "relevance": 0.78
      }
    ],

    "moodContext": {
      "dominant": "motivated",
      "energy": "high",
      "confidence": "medium-high"
    }
  }
}
```

---

## How to Use

### Step 1: Brain Dump in LifeContext

Record your thoughts about the project idea:
- What problem are you solving?
- Why does it matter to you?
- What have you tried before?
- What's missing in existing solutions?
- What would the ideal solution look like?

**Tips for effective brain dumps:**
- Speak freely, don't self-edit
- Include frustrations and emotions
- Mention specific past experiences
- Talk about what you've learned

### Step 2: AI Synthesis

After your brain dump, LifeContext's AI will:
1. **Organize themes** - Group related thoughts
2. **Extract insights** - Key learnings and patterns
3. **Identify contradictions** - Conflicting desires to resolve
4. **Generate questions** - Clarifications to consider
5. **Find related entries** - Past context that's relevant

### Step 3: Export Context Packet

1. Review the synthesis
2. Optionally answer clarifying questions
3. Export as **Context Packet**
4. Copy the JSON output

### Step 4: Feed to Project Generator

```markdown
Read /Users/daniel/Desktop/agent-prompts/PROJECT_GENERATOR_PROMPT.md

## LifeContext (Why - Motivation & Background)
[Paste your Context Packet JSON here]

## Additional Context
[Any technical specifics not captured in brain dump]

Generate all prompts for this project.
```

---

## What Gets Enhanced

When you provide LifeContext, the generator enhances:

| Section | Without LifeContext | With LifeContext |
|---------|---------------------|------------------|
| Problem Statement | Generic | Your actual pain points |
| Target Users | Assumed personas | Based on your experience |
| Competitors | Standard list | Focused on tools you've used |
| Differentiators | Common patterns | Your unique insights |
| Research Focus | Broad | Targeted to your gaps |
| Motivation | Unstated | Clear "why" documented |

---

## Best Practices

### Before Exporting

1. **Do multiple brain dumps** - Revisit the idea over days
2. **Answer clarifying questions** - Resolve contradictions
3. **Review related entries** - Pull in relevant past context
4. **Check mood context** - Ensure you're capturing clearly

### Brain Dump Tips

- **Morning dumps** often capture clearer thinking
- **Evening dumps** capture frustrations from the day
- **After research** - Dump thoughts after looking at competitors
- **After using tools** - Capture specific friction points

### What to Include

- **Frustrations** - What's wrong with existing solutions?
- **Experiences** - What have you learned from past projects?
- **Vision** - What would perfect look like?
- **Constraints** - What must/must not be true?
- **Emotions** - Why do you care about this?

---

## Integration with SpecTree

For maximum effectiveness, combine LifeContext (the "why") with SpecTree (the "what"):

```markdown
Read /Users/daniel/Desktop/agent-prompts/PROJECT_GENERATOR_PROMPT.md

## LifeContext (Why - Motivation)
[Paste LifeContext Context Packet]

## SpecTree (What - Specifications)
[Paste SpecTree Universal JSON]

Generate all prompts for this project.
```

### Workflow Recommendation

1. **Start with LifeContext** - Brain dump your idea
2. **Get synthesis** - Let AI organize your thoughts
3. **Create SpecTree project** - Turn insights into work items
4. **Export both** - Feed to Project Generator
5. **Generate prompts** - Get tailored research/build prompts

---

## Privacy Considerations

### What Gets Exported

- **Synthesized themes** - Not raw transcripts
- **Key insights** - AI-extracted patterns
- **Relevant quotes** - Selected excerpts only
- **Mood context** - Aggregate, not detailed

### What Stays Private

- **Full transcripts** - Never exported unless you choose
- **Unrelated entries** - Only relevant ones included
- **Personal details** - Filtered during synthesis
- **Raw audio** - Always stays on device

### Export Controls

Before exporting:
- Review all included excerpts
- Remove sensitive quotes
- Adjust relevance threshold
- Exclude specific entries

---

## Future Enhancements

### CodeReview AI Integration (Planned)

When CodeReview AI is built:

1. **Context-aware PM Reviews**
   - Understands why features were designed this way
   - More relevant scope checking

2. **Motivation Documentation**
   - Auto-generates "Why" sections in PRs
   - Preserves decision rationale

### Automatic Project Creation (Planned)

- Brain dump → Auto-create SpecTree project
- AI generates initial work items from context
- One-click from idea to project structure

---

## Related Documentation

- [Brain Dump Guide](./BRAIN_DUMP_GUIDE.md) - How to brain dump effectively
- [AI Synthesis](./AI_SYNTHESIS.md) - How synthesis works
- [Privacy Architecture](./PRIVACY.md) - Data handling details
- [Project Generator](file:///Users/daniel/Desktop/agent-prompts/PROJECT_GENERATOR_PROMPT.md) - Master prompt

---

**Document Version:** 1.0.0
**Created:** January 18, 2026
