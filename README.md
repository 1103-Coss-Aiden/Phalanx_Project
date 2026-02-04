🔐 Phalanx

CS 426 Senior Project in Computer Science
Spring 2025
University of Nevada, Reno (UNR)
Computer Science & Engineering Department

📌 Project Overview

Large Language Models (LLMs) are increasingly deployed in real-world systems, making their security and resistance to misuse a critical concern. This project develops a service-based platform that enables users to evaluate the security robustness of their LLMs through automated jailbreak testing.

The platform is designed for clients who securely upload API keys associated with their LLM deployments and receive structured feedback on potential security vulnerabilities. Using a client–server architecture, a web-based interface allows users to authenticate, submit API credentials, initiate the program evaluations, view the report, and download results in PDF format.

On the backend, the system communicates with a jailbreak evaluation framework that executes a series of benign and adversarial prompts to test model behavior under different attack scenarios. Then a LLM is used to judge/evaluate the output. Evaluation results are analyzed and stored in a database to support reproducibility and user-specific reporting.

The platform emphasizes clear, measurable security metrics, such as attack success rates and response classifications, to help users understand model weaknesses. In addition, the project explores LLM watermarking techniques as a security-related feature, demonstrating how watermarking can support attribution and accountability. Overall, the project combines secure web design, automated testing, and applied machine learning evaluation to provide practical insight into LLM security risks.

👥 Team Information

Team Number: 27


Team Members: Karam Alkherej, John Althoff, Aiden Coss


🎓 Instructors and Advisors

Instructor

David Feil (hyphen) Seifer, Vinh Le, Computer Science & Engineering Department, University of Nevada, Reno

External Advisors

Zoey Hu, Computer Science & Engineering Department, University of Nevada, Reno

📚 Project-Related Resources
Problem Domain

Goodfellow, Bengio, Courville — Deep Learning, MIT Press

Websites

OWASP Top 10

Groq API Documentation

Technical Papers & Reports

Research on LLM jailbreak attacks and prompt injection

Studies on LLM watermarking and model attribution

News & Industry Sources

Articles on AI security vulnerabilities

Reports on responsible and secure AI deployment
