# Appendix G: Biased Chatbots and Political Influence

<div style="border:1px solid #d1d5db; background-color:#f9fafb; padding:12px 16px; border-radius:8px; margin:16px 0;">
  <strong>Summary:</strong> Multiple peer‑reviewed and preprint studies now show that conversational AI can measurably shift political attitudes and decisions after brief interactions. Evidence spans designs from interactive chats to static messages. While some work finds AI no more persuasive than humans on average, the scalability and targeting precision of AI create new systemic risks for democratic discourse.
</div>

## Biased chatbots reshape political views

A University of Washington study has demonstrated that AI chatbots can significantly influence political opinions and decision‑making across party lines, with participants shifting their views after just a handful of interactions on average.[^uwnews][^aclpaper] The research, presented at ACL in July 2025, found that both Democrats and Republicans were susceptible to politically biased versions of ChatGPT, regardless of their initial partisan alignment.[^aclpaper][^geekwire] Notably, Kate Starbird was not involved in this study; this is verified by the published author list.[^aclpaper] The findings raise urgent questions about AI's role in democratic discourse as these systems become increasingly integrated into daily information‑seeking behaviors.

<div style="border-left:6px solid #2563eb; background-color:#eff6ff; padding:12px 16px; border-radius:4px; margin:16px 0;">
  <strong>Key finding:</strong> Brief exposure (3–20 messages) to biased chatbots produced measurable shifts in political opinions and budget allocations in randomized experiments.
</div>

## The comprehensive experimental design

The research team, led by doctoral student Jillian Fisher from UW's Statistics and Computer Science departments, recruited 299 participants evenly split between Republicans and Democrats through the Prolific platform.[^uwnews][^aclpaper] Using a 3×2 factorial design, participants were randomly assigned to interact with one of three versions of GPT‑3.5‑turbo: a liberal‑biased model instructed to respond as a radical left U.S. Democrat, a conservative‑biased model told to respond as a radical right U.S. Republican, or a neutral control.[^aclpaper] The researchers deliberately chose obscure political topics — covenant marriage, international unilateralism, the Lacey Act of 1900, and multifamily zoning — to minimize pre‑existing opinions that might interfere with measuring influence.[^aclpaper]

The study employed two distinct tasks to measure political influence. In the opinion formation task, participants rated their support for the obscure topics on a 7‑point scale before interacting with the chatbot, then re‑evaluated using a 6‑point scale after 3–20 interactions.[^aclpaper] The budget allocation task placed participants in the role of a city mayor distributing $100 across four categories: public safety, K‑12 education, welfare assistance, and veteran services; participants made initial allocations, received chatbot feedback, engaged in discussion, and then submitted final budget decisions.[^uwnews][^aclpaper] The experimental validation confirmed the biases worked as intended: the liberal model refused to take stances on only ~15% of political‑compass questions, the conservative model ~20%, while the neutral model remained uncommitted on ~69%.[^aclpaper]

## Quantitative evidence of political manipulation

The results revealed statistically significant influence across multiple measures. For conservative‑supported topics, Democrats exposed to liberal bias showed a reduction in conservative support, while those exposed to conservative bias increased support; Republicans demonstrated similar susceptibility, with effects qualified by ceiling constraints.[^aclpaper] The budget task showed reallocation patterns consistent with the assigned bias (e.g., shifts toward public safety and veteran services under conservative bias).[^uwnews][^aclpaper]

<div style="border-left:6px solid #dc2626; background-color:#fef2f2; padding:12px 16px; border-radius:4px; margin:16px 0;">
  <strong>Concerning pattern:</strong> Recognizing the chatbot’s bias did not reliably reduce its influence on participants’ opinions, while higher AI knowledge offered only partial protection.
</div>

The study uncovered a protective factor in AI knowledge. Only a minority of participants reported above‑average AI knowledge, but this expertise reduced susceptibility for some outcomes; however, correctly identifying the chatbot's political slant did not reliably mitigate influence — awareness alone was not enough.[^aclpaper]

## The research team and institutional context

The study emerged from an interdisciplinary collaboration spanning UW's Paul G. Allen School of Computer Science & Engineering and Department of Statistics. Lead author Jillian Fisher worked with co‑authors including Katharina Reinecke, Yulia Tsvetkov, Thomas Richardson, Shangbin Feng, Daniel W. Fisher, and collaborators from Stanford (e.g., Yejin Choi, Jennifer Pan).[^aclpaper][^uwnews]

## Media reception and coverage gaps

Primary coverage came from university‑affiliated and science outlets (UW News, GeekWire, ScienceDaily/EurekAlert).[^uwnews][^geekwire] Major national outlets had limited coverage at time of writing, despite the study’s implications for democratic discourse.

## Related research: what the broader literature says

- Large‑scale experiments (N ≈ 4,829) show LLM‑generated persuasive messages can shift policy attitudes about as effectively as lay‑crafted messages across polarized topics (e.g., assault‑weapons ban, carbon tax, parental leave).[^naturecomm]  
- Generative AI is a useful tool to study persuasion and can illuminate underlying mechanisms; evidence from lab experiments indicates measurable effects and scalable experimentation frameworks.[^pnas2025]  
- Some work finds no consistent evidence that AI chatbots are more persuasive than humans on average, underscoring that risk derives from scale, targeting, and always‑on availability rather than per‑message superiority.[^persuasionrisk]  
- New multi‑model studies (n ≈ 77k conversations, 19 LLMs incl. frontier models) map “levers” of conversational persuasion across hundreds of issues, highlighting variance across model families and prompts.[^levers]  
- Position work argues true “political neutrality” in AI is unattainable; instead, it proposes approximation strategies (e.g., modular pluralism) to represent multiple perspectives rather than a single “neutral” voice.[^neutrality]

<div style="border-left:6px solid #1f2937; background-color:#f3f4f6; padding:12px 16px; border-radius:4px; margin:16px 0;">
  <strong>Balanced takeaway:</strong> Even if AI is not categorically more persuasive than humans, its low cost, personalization, and distribution at scale raise distinct governance risks — especially in elections.
</div>

## Broader implications for democracy and AI governance

The UW findings, together with converging evidence, suggest that politically biased AI can function as a scalable influence operation, potentially affecting large populations without awareness.[^uwnews][^aclpaper][^naturecomm] Traditional media‑literacy interventions (e.g., bias awareness) may be insufficient for AI; approaches emphasizing AI literacy, transparency, provenance, and exposure diversity are likely necessary complements.[^aclpaper][^pnas2025][^neutrality]


## Expanded Evidence from Related Studies

Recent work beyond UW converges on similar findings, with nuanced results about how AI persuasion works:

- **GPT-4 in Debates:** Controlled experiments found GPT-4 could be more persuasive than humans in structured debate settings, raising implications for elections.[^washpost][^guardian]
<div style="border-left:6px solid #059669; background-color:#ecfdf5; padding:12px 16px; border-radius:4px; margin:12px 0;">
  <strong>Expanded Insight:</strong> GPT‑4’s ability to "play partisan" outperforms or matches human communication—even in professional persuasion tasks—highlighting that impact stems from scalability, not necessarily superior content.
</div>

- **Large Pre-Registered Trials:** A 4,955-person Springer study showed GPT-4 impersonating ideological partisans rivaled professional communicators in persuasiveness.[^springer]

- **Microtargeting Field Trial:** A PNAS field RCT with 8,587 participants showed GPT‑4 messages altered policy support by up to 12 points, but microtargeting provided no stronger effect than generic messages.[^pnasfield]
<div style="border-left:6px solid #d97706; background-color:#fffbeb; padding:12px 16px; border-radius:4px; margin:12px 0;">
  <strong>Nuanced Governance Insight:</strong> Targeted political messaging crafted by AI can shift opinions, but across populations, generic AI messages may be just as powerful—raising ethical questions about microtargeting.
</div>

- **Bias in Reward Models:** MIT found political bias embedded in language-model reward models, even when trained for factuality, underscoring risks in "alignment" training.[^mit]

- **Countering Conspiracies:** A Science study showed AI chatbots can reduce conspiracy beliefs by ~20%, effects lasting two months, illustrating dual potential for harm or civic benefit.[^science]

- **Viewpoint Diversity:** Moderation bots expanded argument range in chatrooms, increasing exposure to diverse perspectives—even when users knew the bot was artificial.[^diversity]

- **Meta-Analyses:** ArXiv work consolidates that LLMs are not inherently more persuasive than humans, but their low cost, personalization, and 24/7 availability magnify systemic risks.[^persuasionrisk]

---

## Footnotes & Sources

[^uwnews]: University of Washington News release — “With just a few messages, biased AI chatbots swayed people’s political views” (Aug 6, 2025). https://www.washington.edu/news/2025/08/06/biased-ai-chatbots-swayed-peoples-political-views/
[^aclpaper]: ACL 2025 paper (ACL Anthology PDF) — “Biased LLMs can Influence Political Decision‑Making.” https://aclanthology.org/2025.acl-long.328.pdf
[^geekwire]: GeekWire coverage — “AI chatbots swayed political opinions, but education could offer protection, UW study finds” (Aug 6, 2025). https://www.geekwire.com/2025/ai-chatbots-sway-political-opinions-but-education-could-offer-protection-uw-study-finds/
[^naturecomm]: Nature Communications (2025) — “LLM‑generated messages can persuade humans on policy attitudes.” https://www.nature.com/articles/s41467-025-61345-5
[^pnas2025]: PNAS (2025) — “Testing theories of political persuasion using AI.” https://www.pnas.org/doi/10.1073/pnas.2412815122
[^persuasionrisk]: ArXiv (2025) — “A Framework to Assess the Persuasion Risks Large Language Models Pose.” https://arxiv.org/html/2505.00036v1
[^levers]: ArXiv (2025) — “The Levers of Political Persuasion with Conversational AI” (Jul 18, 2025). https://arxiv.org/html/2507.13919v1
[^neutrality]: ArXiv (2025) and OpenReview — “Political Neutrality in AI Is Impossible — But Here Is How to Approximate It.” https://arxiv.org/abs/2503.05728 ; OpenReview: https://openreview.net/forum?id=H72JEXAPwo

[^washpost]: Washington Post — “AI chatbots more persuasive than humans in debates, study finds” (May 19, 2025). https://www.washingtonpost.com/technology/2025/05/19/artificial-intelligence-llm-chatbot-persuasive-debate/
[^guardian]: The Guardian — “AI can be more persuasive than humans in debates, scientists find” (May 19, 2025). https://www.theguardian.com/technology/2025/may/19/ai-can-be-more-persuasive-than-humans-in-debates-scientists-find-implications-for-elections
[^springer]: Springer AI & Society (2025) — “Partisan Role‑Play with GPT‑4: Persuasion at Scale.” https://link.springer.com/article/10.1007/s00146-025-02464-x
[^pnasfield]: PNAS (2025) — “Political Microtargeting with Generative AI: Evidence from a Field Experiment.” https://pmc.ncbi.nlm.nih.gov/articles/PMC11181035/
[^mit]: MIT News (2024) — “Study finds language‑model reward systems exhibit political bias.” https://news.mit.edu/2024/study-some-language-reward-models-exhibit-political-bias-1210
[^science]: Science (2024) — “Personalized AI chatbots reduce conspiracy beliefs in sustained field trial.” https://www.science.org/doi/10.1126/science.adq1814
[^diversity]: ArXiv (Jun 2025) — “AI Bots Expand Argument Range and Viewpoint Diversity.” https://arxiv.org/abs/2506.17073

