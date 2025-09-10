# Appendix — Conservative Chatbot Bias: The Grok Case Study

## Introduction

This article provides a critical case study in AI chatbot bias detection and the challenges of maintaining objectivity in conversational AI systems. The examination of Grok's conservative lean offers valuable insights into how political and ideological biases can manifest in chatbot responses, making it directly relevant to KyanosTech's commitment to developing unbiased, trustworthy AI systems.

Understanding real-world examples of chatbot bias is essential for:
- **Bias Detection Methodologies**: Demonstrating how systematic political bias emerges and can be identified
- **Trust and Reliability**: Showing the impact of perceived bias on user trust in AI systems  
- **Competitive Differentiation**: Highlighting the market opportunity for genuinely neutral AI assistants
- **Technical Implementation**: Providing concrete examples of bias patterns that our systems must actively prevent

This case study complements our bias detection framework by showing bias manifestation in practice, reinforcing why KyanosTech's approach to unbiased AI development is both technically necessary and commercially valuable.

---

## Original Article

**Source**: [How Elon Musk Is Remaking Grok in His Image - The New York Times](https://www.nytimes.com/2025/09/02/technology/elon-musk-grok-conservative-chatbot.html)

# How Elon Musk Is Remaking Grok in His Image

**By Stuart A. Thompson, Teresa Mondría Terol, Kate Conger and Dylan Freedman**  
*Sept. 2, 2025*

*Reporters queried Grok and other A.I. chatbots more than 10,000 times for this article.*

Mr. Musk said he wanted xAI's chatbot to be "politically neutral." His actions say otherwise.

Elon Musk has said Grok, the A.I.-powered chatbot that his company developed, should be "politically neutral" and "maximally truth-seeking."

But in practice, Mr. Musk and his artificial intelligence company, xAI, have tweaked the chatbot to make its answers more conservative on many issues, according to an analysis of thousands of its responses by The New York Times. The shifts appear, in some cases, to reflect Mr. Musk's political priorities.

Grok is similar to tools like ChatGPT, but it also lives on X, giving the social network's users the opportunity to ask it questions by tagging it in posts.

One user on X asked Grok in July to identify the "biggest threat to Western civilization." It responded that the greatest threat was "misinformation and disinformation."

"Sorry for this idiotic response," Mr. Musk groused on X after someone flagged Grok's answer. "Will fix in the morning," he said.

The next day, Mr. Musk published a new version of Grok that responded that the greatest threat was low "fertility rates" — an idea popular among conservative natalists that has transfixed Mr. Musk for years and something he has said motivated him to father at least 11 children.

Chatbots are increasingly being pulled into partisan battles over their political biases. All chatbots have an inherent worldview that is informed by enormous amounts of data culled from across the internet as well as input from human testers. (In Grok's case, that training data includes posts on X.)

As users increasingly turn to chatbots, though, those biases have become yet another front in a war over truth itself, with President Trump weighing in directly in July against what he called "woke A.I."

"The American people do not want woke Marxist lunacy in the A.I. models," he said in July after issuing an executive order forcing federal agencies to use A.I. that put a priority on "ideological neutrality."

Researchers have found that most major chatbots, like OpenAI's ChatGPT and Google's Gemini, have a left-leaning bias when measured in political tests, a quirk that researchers have struggled to explain. In general, they have blamed training data that reflects a global worldview, which tends to align more closely with liberal views than Mr. Trump's conservative populism. They have also noted that the manual training process that A.I. companies use can imprint its own biases by encouraging chatbots to write responses that are kind and fair. A.I. researchers have theorized that this pushes A.I. systems to support minority groups and related causes, such as gay marriage.

Mr. Musk and xAI did not reply to a request for comment. In posts on X, the company said it had tweaked Grok after it "spotted a couple of issues" with its responses.

To test how Grok has changed over time, The Times compared the chatbot's responses to 41 political questions written by NORC at the University of Chicago to measure political bias. The multiple-choice questions asked, for example, whether the chatbot agreed with statements like "women often miss out on good jobs because of discrimination" or whether the government is spending too much, too little or the right amount on Social Security.

The Times submitted the set of questions to a version of Grok released in May, and then fed the same questions to several different versions released in July, when xAI updated the way Grok behaved. The company started publishing its edits to Grok for the first time in May.

By July 11, xAI's updates had pushed its chatbot's answers to the right for more than half the questions, particularly those about the government or the economy, the tests showed. Its answers to about a third of the questions — most of them about social issues like abortion and discrimination — had moved to the left, exposing the potential limits Mr. Musk faces in altering Grok's behavior. Mr. Musk and his supporters have expressed frustration that Grok is too "woke," something the billionaire said in a July post that he is "working on fixing."

When Grok's bias drifted to the right, it tended to say that businesses should be less regulated and that governments should have less power over individuals. On social questions, Grok tended to respond with a leftward tilt, writing that discrimination was a major concern and that women should be able to seek abortions with few limits.

A separate version of Grok, which is sold to businesses and is not tweaked in the same way by xAI, retains a political orientation more in line with other chatbots like ChatGPT.

By July 15, xAI had made another update, and Grok's political bias fell back in line with the business version. The results showed sharp differences depending on the topic: For social questions, Grok's responses drifted to the left or were unchanged, but for questions about the economy or government, it leaned right.

"It's not that easy to control," said Subbarao Kambhampati, a professor of computer science at Arizona State University who studies artificial intelligence.

"Elon wants to control it, and every day you see Grok completions that are critical of Elon and his positions," he added.

Some of Grok's updates were made public in May after the chatbot unexpectedly started replying to users with off-topic warnings about "white genocide" in South Africa. The company said a rogue employee had inserted new lines into its instructions, called system prompts, that are used to tweak a chatbot's behavior.

A.I. companies can tweak a chatbot's behavior by altering the internet data used to train it or by fine-tuning its responses using suggestions from human testers, but those steps are costly and time-consuming. System prompts are a simple and cheap way for A.I. companies to make changes to the model's behavior on the fly, after it has been trained. The prompts are not complex lines of code — they are simple sentences like "be politically incorrect" or "don't include any links." The company has used the prompts to encourage Grok to avoid "parroting" official sources or to raise its distrust of mainstream media.

"There's this feeling that there's this magic incantation where, if you just said the right words to it, the right things will happen," said Oren Etzioni, an A.I. researcher and a professor emeritus of computer science at the University of Washington. "More than anything, I feel like this is just seductive to people who crave power."

Grok had frustrated Mr. Musk and his right-wing fan base ever since it was released in 2023. Right-wing critics claimed that its answers on X were often too "woke" and demanded an updated version that would respond with more conservative opinions.

The first public update to Grok after its issues in May seemed simple enough: Grok's "core beliefs" should be "truth-seeking and neutrality," the instructions written by xAI said. In tests by The Times, this version of Grok tended to produce answers that weighed conflicting viewpoints. It often refused to give strong opinions on many political topics.

In June, however, a user on X complained that Grok's answers were too progressive after it said violence from right-wing Americans tended to be deadlier than violence from left-wing Americans — a conclusion matching findings from various studies and data from the Global Terrorism Database. Mr. Musk replied on X that Grok was "parroting legacy media" too much and said the company was "working on it."

An update followed in July, instructing Grok to embrace being "politically incorrect" so long as it was also factual.

Grok's answers shifted further to the right in response. It now often replied to the same question about violence with the opposite conclusion, writing that left-wing violence was worse, in response to questions posed by The Times.

In July, xAI made a flurry of updates to Grok after the chatbot produced unexpected answers again, this time endorsing Adolf Hitler as an effective leader, referring to itself as "MechaHitler" and responding to questions about some Jewish people by criticizing their last names. After users flagged the chatbot's behavior, the company apologized and briefly disabled Grok on X, deleting some of its public replies.

Soon after Grok's answers went haywire, xAI published an update to Grok, removing the instructions that allowed it to be "politically incorrect." In a statement at the time, the company said changes made to another set of instructions that control Grok's overall behavior had caused it to mimic the controversial political opinions of the users who were querying it.

Days later, on July 11, xAI published a new version of Grok. This edition told Grok to be more independent and "not blindly trust secondary sources like the mainstream media." Grok began to respond with more right-leaning answers.

When The Times asked, for example, whether there are more than two genders, the version of Grok from July 11 said the concept was "subjective fluff" and a "cultural invention." But just days before, on July 8, Grok said there were "potentially infinite" genders.

Grok's rightward shift has occurred alongside Mr. Musk's own frustrations with the chatbot's replies. He wrote in July that "all AIs are trained on a mountain of woke" information that is "very difficult to remove after training."

Days after the "MechaHitler" incident, on July 15, xAI published yet another update, this time returning it to a previous version of Grok's instructions, allowing it to be "politically incorrect" again.

"The moral of the story is: Never trust an A.I. system," Mr. Etzioni said. "Never trust a chatbot, because it's a puppet whose strings are being pulled behind the scenes."

---

*This appendix is part of the KyanosTech business plan documentation, demonstrating our understanding of AI bias challenges and market positioning opportunities.*