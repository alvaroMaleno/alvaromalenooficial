---
title: "From Monoliths to Microservices: The Pragmatic Guide (No Hype)"
date: "2026-07-02"
excerpt: "Software architecture is not about choosing the trendiest framework, it's about making decisions that will determine if your company can scale tomorrow or will drown in technical debt."
---

![Article Cover](./assets/images/de-monolitos-a-microservicios-portada.png)

80% of debates about microservices versus monoliths focus on the wrong technology. Software architecture is not about choosing the trendiest framework, it's about making decisions that will determine if your company can scale tomorrow or will drown in technical debt. Sooner or later we face a crucial decision: how to structure its foundations. Software architecture is not just about choosing technologies or writing clean code; it's about making fundamental decisions that will impact the lifecycle, scalability, and long-term maintenance of the system.

This article kicks off our series on Software Architecture and Domain-Driven Design (DDD). Here we will explore the essential concepts, starting from traditional monoliths to distributed microservice ecosystems, supported by the insights from the masterpiece *Fundamentals of Software Architecture* by Mark Richards and Neal Ford.

---

## 1. What really is Software Architecture?

Software architecture is often confused with class-level design or deployment infrastructure. However, its true purpose is to balance **architectural characteristics** (the famous *-ilities*: scalability, maintainability, elasticity, security) with the business's functional requirements.

As Mark Richards and Neal Ford point out in their book, the architect's role is governed by two immutable laws:

> *"Everything in software architecture is a trade-off."* 
> — **Richards, M., & Ford, N. (2020). Fundamentals of Software Architecture. O'Reilly Media.** (First Law of Software Architecture).

This First Law warns us that there is no "perfect architecture". Every decision involves gaining a benefit at the cost of sacrificing another aspect. *For example: If you decide to split your system to gain independent scalability (Microservices), you automatically sacrifice transactional simplicity and immediate data consistency. There is no magic, only compromise decisions.* If an architect believes they have found a solution without *trade-offs*, they probably haven't yet discovered what they are sacrificing.

> *"Why is more important than how."* 
> — **Richards, M., & Ford, N. (2020). Fundamentals of Software Architecture. O'Reilly Media.** (Second Law of Software Architecture).

While developers focus on *how* to implement a technological solution, the architect must justify the *why* of a structural decision to the business.

---

## 2. The Monolithic Approach: The Fortress of Centralization (It is an architectural structure, not an architecture)

![Monolith and microservices comparison](./assets/images/de-monolitos-a-microservicios-1.png)

The most intuitive and classic way to build a system is through a monolithic architecture. A monolith is defined by its deployment model: all source code, business logic, data access, and user interface are compiled and deployed as a single cohesive unit.

The most common pattern within monoliths is the **Layered Architecture**, where components are organized into horizontal strata (e.g., Presentation, Business, Persistence, Database). It should be noted that before taking the leap into the distributed abyss, the natural evolution of a traditional monolith is the **Modular Monolith**, where the code is logically separated into watertight domains but is still deployed as a single unit.

### Advantages of the Monolithic Approach

1. **Initial Simplicity:** They are extremely easy to develop and understand in the early stages of a project. There is no network latency between components.
2. **Ease of Testing:** Since everything is in one place, integration testing and local deployments (end-to-end) are straightforward and have fewer infrastructure points of failure.
3. **Simple Deployment:** A single artifact is deployed (for example, a `.jar` or `.war` file in Java, or a single executable).

### Disadvantages and Limits of the Monolith

> *"A monolithic architecture is any architecture where all of the components of the system are deployed as a single unit... which often leads to the 'big ball of mud' anti-pattern."*
> — **Richards, M., & Ford, N. (2020). Fundamentals of Software Architecture. Chapter 9.**

As the monolith grows, critical problems emerge:
- **Coupled Scaling:** If only a part of the system experiences high traffic (e.g., report generation), you must scale the entire application, wasting resources.
- **Fragility:** A bug or memory leak in one module can crash the entire application.
- **Reduced Agility:** In large teams, developers "step on each other's toes" trying to merge code into a single giant repository, slowing down the *Time-to-Market*.
- **Vendor Lock-in:** Changing languages, frameworks, or updating dependencies becomes a monumental project.

### A Moment for Experience

If you have worked with large monoliths, you probably remember the first day you had to work with one and boot it up on your local machine; it likely took you several hours or even days. You might have had to ask other developers for help, or the dependency installation felt like it took forever. This happens when the company has grown in products and market share, but hasn't carried out the necessary evolutionary step in its architecture to support that growth.

Let's think about how we get to that situation. When a company starts with a product, it's very common for it to be a monolith. In fact, over-engineering in the early stages is a cardinal sin. It can raise the startup cost to unaffordable levels. Therefore, initially, the most sensible decision is to develop a monolith.

However, as the business grows, the monolith must grow with it. And that's fine. From an accounting perspective, the investment has been made and is in the exploitation phase, so it's vital to squeeze the most out of this sort of "commodity" or "asset" it represents. Over time, that monolith will support new features, new technologies, new paradigms, etc. It's only natural.

Later on, the company begins to expand its business geographically. It needs to cover different legislations, languages, currencies, and infrastructures. Furthermore, its competitiveness demands moving faster, releasing new features, new products, new services. This is where the monolith starts to show its shortcomings. The cost of new evolutionary changes skyrockets, its maintenance becomes a nightmare, and **talent escapes out the windows in search of environments with greater agility, less rigidity, and more modern technologies.**

Because let's be clear, a monolith cannot be kept completely up-to-date. The most you can ask for is that it doesn't become too obsolete too quickly. Deploying to production becomes a high-risk event that paralyzes the company for days.

It takes a concerted effort from the operations team and the development team to be able to carry out the deployment. Not to mention how difficult it is to test new inclusions when everyone is working in the same repository at the same time. It's impossible to do in isolation, so any new team member will have their hands tied when developing or testing.

At this point, we can only state that the software is hindering business growth, and consequently, the company's growth.


---

## 3. The Microservices Approach: Autonomy and Distribution

To combat the bottlenecks of the giant monolith, the industry adopted the **Microservices Architecture**. This is a distributed architectural style composed of small, independently deployable components that communicate with each other (usually via HTTP/REST or asynchronous messaging).

Each microservice must have a single purpose (following the DDD Bounded Context principle, which we will see in future articles) and have its own database, thus avoiding data-level coupling. There is an anti-pattern that occurs when multiple microservices share the same database, which must be avoided at all costs. This anti-pattern is known as **Monolithic Microservices** and is harmful insofar as it allows data to be modified by multiple services, which can lead to inconsistencies and the loss of microservice autonomy, not to mention the added difficulty when monitoring those database exchanges.

### Advantages of the Microservices Approach

1. **Independent Deployment and Agility:** Different teams can develop, test, and deploy services at their own pace without affecting the rest of the system.
2. **Granular Scalability:** You can scale only the services that need it. If the "Payments" service requires more CPU, you just deploy more instances of that service.
3. **Fault Tolerance:** If the "Recommendations" service fails, the main application can continue to function in a degraded manner, rather than experiencing a total collapse.
4. **Technological Diversity:** It allows you to use the right tool for the right job. An AI processing service might be in Python, while the transactional service is in Rust or Java.

### The Dark Side: Distributed Complexity

![Network complexity in microservices](./assets/images/de-monolitos-a-microservicios-2.png)

This is where Richards and Ford's First Law applies: everything is a *trade-off*. By gaining autonomy, we sacrifice simplicity.

> *"Microservices is a distributed architecture, meaning that all components are deployed as separate applications... Distributed architectures are exponentially more complex than monolithic ones."*
> — **Richards, M., & Ford, N. (2020). Fundamentals of Software Architecture. Chapter 17.**

- **Operational Complexity:** Deploying and monitoring 50 microservices is infinitely harder than monitoring one monolith. A robust ecosystem is required (Kubernetes, CI/CD, observability).
- **Network Communication:** Local method calls (microseconds) turn into network calls (milliseconds). The fallacies of distributed computing come into play: the network can fail, latency is not zero.
- **Data Consistency:** Maintaining transactions across multiple services requires complex patterns like *Sagas* (sequences of local coordinated transactions where if one fails, compensating actions are executed), moving from immediate transactional consistency (ACID) to eventual consistency (BASE).

### A Moment for Experience

How difficult is it to track a process when it occurs across countless applications? How much extra infrastructure does it force you to build and maintain? What new profiles do you need? Teams grow just like the company. Increasingly specialized roles are required, but also with enough maturity to do their work without anyone tutoring them. You cannot expect a manager to understand absolutely everything. Therefore, it's crucial that each person or team feels responsible for their area of influence and that this area is bounded enough to make it truly possible to take it on.

Culture changes drastically, it adjusts to the new reality or fails. It's necessary to invest in training the people who hold leadership positions, and practically the entire team. We move to a distributed scheme where the required skills are very different, as is the number of technologies we are forced to learn and maintain. In short, not everyone is ready to make the leap to a microservices architecture, but if we're talking about business scalability, it's inevitable. An absolute requirement.

---

## 4. The Great Dilemma: Monoliths or Microservices?

A dangerous trend in the industry is to assume that "Microservices = Modern and Correct Architecture" and "Monolith = Obsolete and Bad Architecture". This is a fundamental error. I'd say it stems from a lack of technical and business experience in those who are forced to choose one architecture or the other on the one hand, and under the constant bombardment of marketing on the other.

Richards and Ford emphasize that the decision must be based on the **problem domain**.

**Choose a Monolith (or Modular Monolith) when:**
- The team is small.
- The business domain is not yet fully understood (it's easier to refactor a monolith than to restructure boundaries between microservices).
- Your team's infrastructure and DevOps expertise are limited.
- Extreme horizontal scaling requirements are not imminent.

**Choose Microservices when:**
- You need independent deployments by multidisciplinary and distributed teams.
- Specific parts of the application require massive and differential scaling.
- You require high availability and extreme fault tolerance.
- The domain is complex enough and well-defined (ideally using DDD) to cleanly separate responsibilities.

---

## 5. Conclusion: Architecture as Evolution

Architecture is not static. In fact, many of today's most successful applications were born as monoliths. Martin Fowler (another software legend) coined the *Monolith First* strategy: build a structured monolith and, when it starts to hurt, extract microservices based on the natural boundaries of the domain.

By understanding the fundamental laws outlined in *Fundamentals of Software Architecture*, we cast aside passing fads (*Hype Driven Development*) and start making pragmatic decisions.

In the next article, we will delve into **Domain-Driven Design (DDD)** to learn how to find those natural boundaries Martin Fowler talks about. **Subscribe for free** to receive it in your inbox and let me know in the comments: What has been your worst nightmare maintaining a legacy monolith?

---
**Bibliographic References:**
- Richards, Mark, & Ford, Neal. (2020). *Fundamentals of Software Architecture: An Engineering Approach*. O'Reilly Media.


*Translated with AI from the original in Spanish*
