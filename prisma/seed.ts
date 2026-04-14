import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.calendarEvent.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.session.deleteMany();
  await prisma.client.deleteMany();
  await prisma.settings.deleteMany();

  // Settings
  await prisma.settings.create({
    data: {
      id: "default",
      businessName: "Halfnote Healing",
      practitionerName: "Sarah Meadows",
      email: "sarah@halfnotehealing.ca",
      phone: "(604) 555-0192",
      address: "Vancouver, BC, Canada",
      defaultDuration: 60,
      defaultType: "google-meet",
      defaultRate: 150.0,
      paymentTerms: "Payment due within 14 days of invoice date. E-transfer preferred.",
      paymentDetails: "E-transfer to: sarah@halfnotehealing.ca",
    },
  });

  // Clients
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        firstName: "Maya",
        lastName: "Chen",
        email: "maya.chen@email.com",
        phone: "(604) 555-0234",
        dateOfBirth: new Date("1989-03-15"),
        intakeNotes:
          "Maya came in feeling disconnected from her body after a difficult year of transitions — career change, end of a long relationship, relocation to Vancouver. She describes a persistent tightness in her chest and a feeling of 'floating above' her life rather than being in it. Strong intuitive capacity but tends to intellectualize emotions. Root and sacral chakras feel significantly blocked. Previous experience with talk therapy but seeking something more somatic and energetic.",
        tags: "active",
      },
    }),
    prisma.client.create({
      data: {
        firstName: "David",
        lastName: "Okonkwo",
        email: "david.o@email.com",
        phone: "(778) 555-0187",
        dateOfBirth: new Date("1975-11-02"),
        intakeNotes:
          "David is a high-performing executive who has been experiencing panic attacks for the past 6 months. Traditional medicine found nothing wrong physically. He describes feeling like he is 'carrying the weight of the world' — particularly around providing for his family and aging parents. Very grounded and practical person, somewhat skeptical of energy work but open to trying. Third eye and throat chakra areas feel constricted. He has difficulty expressing vulnerability.",
        tags: "active",
      },
    }),
    prisma.client.create({
      data: {
        firstName: "Luna",
        lastName: "Fernandez",
        email: "luna.f@email.com",
        dateOfBirth: new Date("1995-07-22"),
        intakeNotes:
          "Luna is a yoga teacher and Reiki Level 1 practitioner who is going through a significant spiritual awakening. She has been experiencing vivid dreams, spontaneous crying, and heightened sensitivity to others' emotions. She wants to learn how to manage these experiences and deepen her practice. Crown and heart chakras are very active. She may benefit from grounding work to balance the upper chakra activity.",
        tags: "active",
      },
    }),
    prisma.client.create({
      data: {
        firstName: "James",
        lastName: "Whitfield",
        email: "james.w@email.com",
        phone: "(604) 555-0912",
        intakeNotes:
          "James is processing grief after losing his mother six months ago. He describes feeling numb and unable to cry. He was very close with his mother and feels guilty about things left unsaid. His heart chakra feels armored — protective but restricting. Gentle approach needed. He responds well to breathwork.",
        tags: "paused",
      },
    }),
    prisma.client.create({
      data: {
        firstName: "Priya",
        lastName: "Sharma",
        email: "priya.s@email.com",
        phone: "(778) 555-0456",
        dateOfBirth: new Date("1992-01-10"),
        intakeNotes:
          "Priya completed a 6-session healing journey focused on releasing ancestral trauma patterns. She identified patterns of self-sacrifice and people-pleasing inherited from her mother and grandmother. By the final sessions, she reported feeling lighter, more boundaried, and more connected to her own desires rather than others' expectations. Strong progress. May return for maintenance sessions.",
        tags: "completed",
      },
    }),
  ]);

  const [maya, david, luna, james, priya] = clients;

  // Sessions
  const now = new Date();
  const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000);
  const daysFromNow = (n: number) => new Date(now.getTime() + n * 86400000);

  const sessions = await Promise.all([
    // Maya sessions
    prisma.session.create({
      data: {
        clientId: maya.id,
        date: daysAgo(28),
        duration: 60,
        type: "google-meet",
        status: "completed",
        notes:
          "First session with Maya. Spent time building rapport and understanding her current state. She spoke at length about her career transition — leaving corporate law to pursue UX design. The breakup happened simultaneously and she describes feeling like her identity dissolved. Did a gentle body scan meditation together. She noticed tension in her solar plexus and tightness across her shoulders. Introduced basic grounding techniques — barefoot walking, root visualization. She connected quickly with the root chakra imagery. Ended with a brief energy clearing focused on her chest area. She reported feeling 'a little more here' afterward.",
        summary:
          "**Key Themes**\n- Identity dissolution after major life transitions (career change, breakup, relocation)\n- Disconnection from body, feeling of floating above life\n- Tension held in solar plexus and shoulders\n\n**Client State**\nMaya presented as articulate but emotionally guarded. She intellectualizes her experiences as a way of maintaining control. Beneath the composure, there is grief and fear about the unknown.\n\n**Modalities Used**\n- Body scan meditation\n- Root chakra visualization\n- Basic grounding techniques\n- Energy clearing (chest area)\n\n**Insights & Breakthroughs**\nMaya connected quickly with root chakra imagery, suggesting strong intuitive capacity despite her analytical tendencies.\n\n**Follow-Up Actions**\n- Practice barefoot walking daily for 10 minutes\n- Journal about what 'being in her body' feels like\n- Explore the solar plexus tension — what is she holding onto?",
        followUpActions: "Practice grounding exercises daily. Journal about body sensations.",
      },
    }),
    prisma.session.create({
      data: {
        clientId: maya.id,
        date: daysAgo(14),
        duration: 60,
        type: "google-meet",
        status: "completed",
        notes:
          "Maya returned with more awareness of her body. She has been doing the barefoot walking practice and noticed she sleeps better on days she does it. She journaled about body sensations and noticed that the tightness in her chest often comes when she thinks about her ex — specifically about whether she made the right decision. We worked on heart chakra opening today — guided visualization of green light expanding from her chest. She cried during this, which felt like a release. She admitted she has been avoiding feeling sad because she is afraid once she starts she will not stop. We held space for that fear. Introduced a containment visualization — a golden vessel where she can place feelings she is not ready to fully process yet.",
        followUpActions: "Continue grounding. Try the containment visualization before bed. Allow sadness when it comes — 10 minutes at a time.",
      },
    }),
    prisma.session.create({
      data: {
        clientId: maya.id,
        date: daysFromNow(1),
        duration: 60,
        type: "google-meet",
        googleMeetLink: "https://meet.google.com/abc-defg-hij",
        status: "scheduled",
        notes: "",
      },
    }),
    // David sessions
    prisma.session.create({
      data: {
        clientId: david.id,
        date: daysAgo(21),
        duration: 90,
        type: "google-meet",
        status: "completed",
        notes:
          "Extended first session with David. He was initially stiff and unsure — kept asking what he should be doing. Normalized his skepticism and explained that we would go at his pace. Started with simple breathwork — 4-7-8 breathing. He struggled to slow his breath at first but settled in after a few minutes. When we explored the panic attacks, he described them as 'my body betraying me.' Reframed this as his body trying to communicate something important. He got quiet and said he has never thought of it that way. Did a throat chakra exercise — humming vibration — which he found surprisingly calming. He opened up about his father's expectations and the pressure to be the family provider after his father's stroke. Deep well of suppressed emotion here.",
        summary:
          "**Key Themes**\n- Panic attacks as bodily communication, not betrayal\n- Pressure of family provider role, especially after father's stroke\n- Suppressed emotions around vulnerability and duty\n- Difficulty slowing down and being present\n\n**Client State**\nDavid is guarded but willing. His body carries significant tension, particularly in the jaw, throat, and shoulders. He approached the session with the same problem-solving mindset he uses at work.\n\n**Modalities Used**\n- 4-7-8 breathwork\n- Throat chakra humming exercise\n- Cognitive reframing (body as communicator vs. betrayer)\n\n**Insights & Breakthroughs**\nThe reframe of panic attacks as communication was a significant shift for David. He sat with it quietly, which suggests it landed deeply.\n\n**Follow-Up Actions**\n- Practice 4-7-8 breathing twice daily (morning and before bed)\n- Notice when he is clenching his jaw throughout the day\n- Write a letter to his body (does not need to share it)",
        followUpActions: "4-7-8 breathing 2x daily. Jaw awareness. Letter to body exercise.",
      },
    }),
    prisma.session.create({
      data: {
        clientId: david.id,
        date: daysAgo(7),
        duration: 60,
        type: "google-meet",
        status: "completed",
        notes:
          "David came in noticeably more relaxed. He has been doing the breathing exercises and says they help with falling asleep. He wrote the letter to his body but has not read it yet — says it felt strange but also cathartic. We went deeper into the family dynamics today. He described his father as a man who never showed weakness, and how David adopted that same pattern. We did a guided meditation where he visualized talking to his younger self — the boy who first decided he needed to be strong for everyone. He became emotional during this but caught himself and apologized. We spent time normalizing emotion as strength. Ended with gentle energy work on his throat and heart chakras. He reported feeling 'lighter' in his chest afterward.",
        followUpActions: "Read the letter aloud (to himself, in a safe space). Continue breathwork. Notice moments when he stops himself from being vulnerable.",
      },
    }),
    prisma.session.create({
      data: {
        clientId: david.id,
        date: daysFromNow(3),
        duration: 60,
        type: "google-meet",
        googleMeetLink: "https://meet.google.com/klm-nopq-rst",
        status: "scheduled",
      },
    }),
    // Luna sessions
    prisma.session.create({
      data: {
        clientId: luna.id,
        date: daysAgo(10),
        duration: 60,
        type: "google-meet",
        status: "completed",
        notes:
          "Luna came in buzzing with energy — literally. She described a week of intense dreams involving water and ancestors she has never met. She has been absorbing others' emotions in her yoga classes and feeling drained. Discussed energetic boundaries and shielding techniques. Taught her a golden egg visualization for protection. We also explored grounding — she tends to live in the upper chakras (crown, third eye) and neglect the lower ones. Did a full chakra balancing meditation, spending extra time on root and sacral. She said she could feel her feet for the first time in weeks. Recommended she reduce her meditation time temporarily and spend more time in nature, cooking, or doing physical activities.",
        followUpActions: "Golden egg protection before yoga classes. More grounding activities. Reduce meditation to 15 min max for now.",
      },
    }),
    // James sessions
    prisma.session.create({
      data: {
        clientId: james.id,
        date: daysAgo(45),
        duration: 60,
        type: "in-person",
        status: "completed",
        notes:
          "James sat quietly for the first 10 minutes. I let the silence be. When he spoke, he talked about his mother's garden — how she grew tomatoes every summer and how the garden is now overgrown. He said he cannot bring himself to tend it or let it go. This feels like a metaphor for his grief. We did a gentle breathwork session focused on the heart space. He breathed deeply but no tears came. He said he feels like there is a wall between him and his emotions. We did not push it. Introduced the idea of grief having its own timeline and that numbness is a valid part of the process. He seemed relieved by this. Ended with a simple loving-kindness meditation directed toward his mother.",
        followUpActions: "No homework — just be gentle with himself. Maybe visit the garden, even just to sit in it.",
      },
    }),
    prisma.session.create({
      data: {
        clientId: james.id,
        date: daysAgo(30),
        duration: 60,
        type: "in-person",
        status: "completed",
        notes:
          "James visited his mother's garden this week. He sat on her bench for an hour and cried for the first time since the funeral. He described feeling both broken and relieved. Today we worked with that opening — did heart chakra work with rose quartz visualization. He was able to stay present with the sadness without shutting down. He spoke about specific memories — her laugh, the way she hummed while cooking. He asked to pause our sessions for a while to process on his own. I supported this decision. Door remains open.",
        followUpActions: "Pausing sessions per James's request. Follow up in 4-6 weeks to check in.",
      },
    }),
    // Priya sessions (completed journey)
    prisma.session.create({
      data: {
        clientId: priya.id,
        date: daysAgo(90),
        duration: 60,
        type: "google-meet",
        status: "completed",
        notes:
          "Final session in Priya's 6-session series. She reflected on her journey from feeling trapped in patterns of self-sacrifice to feeling more connected to her own needs and desires. She has set boundaries with her family around holiday obligations and is feeling proud of that. We did a closing ceremony — acknowledging the ancestral patterns she has released and setting intentions for what she is calling in. She wants to cultivate self-trust and creative expression. She left feeling complete but open to returning for tune-ups as needed.",
        summary:
          "**Key Themes**\n- Completion of ancestral healing journey\n- Successful boundary-setting with family\n- Transition from self-sacrifice patterns to self-trust\n\n**Client State**\nPriya appeared grounded, confident, and genuinely lighter. A marked shift from her first session where she described feeling weighted by obligations that were not hers.\n\n**Modalities Used**\n- Closing ceremony and intention setting\n- Reflective dialogue\n- Ancestral pattern release acknowledgment\n\n**Insights & Breakthroughs**\nPriya recognized that the boundary-setting she feared most (with her mother around holidays) actually brought them closer rather than creating distance.\n\n**Follow-Up Actions**\n- Continue journaling practice\n- Explore creative outlets (she mentioned pottery)\n- Return for maintenance sessions as needed",
        followUpActions: "Journey complete. Open for maintenance sessions as needed.",
      },
    }),
  ]);

  // Invoices
  await Promise.all([
    prisma.invoice.create({
      data: {
        clientId: maya.id,
        sessionId: sessions[0].id,
        amount: 150.0,
        status: "paid",
        issuedDate: daysAgo(27),
        dueDate: daysAgo(13),
        paidDate: daysAgo(20),
        invoiceNumber: "INV-2026-001",
      },
    }),
    prisma.invoice.create({
      data: {
        clientId: maya.id,
        sessionId: sessions[1].id,
        amount: 150.0,
        status: "sent",
        issuedDate: daysAgo(13),
        dueDate: daysFromNow(1),
        invoiceNumber: "INV-2026-002",
      },
    }),
    prisma.invoice.create({
      data: {
        clientId: david.id,
        sessionId: sessions[3].id,
        amount: 200.0,
        status: "paid",
        issuedDate: daysAgo(20),
        dueDate: daysAgo(6),
        paidDate: daysAgo(15),
        invoiceNumber: "INV-2026-003",
        notes: "Extended session (90 min)",
      },
    }),
    prisma.invoice.create({
      data: {
        clientId: david.id,
        sessionId: sessions[4].id,
        amount: 150.0,
        status: "overdue",
        issuedDate: daysAgo(6),
        dueDate: daysAgo(1),
        invoiceNumber: "INV-2026-004",
      },
    }),
  ]);

  // Calendar events (matching sessions + some personal blocks)
  await Promise.all([
    // Upcoming sessions as calendar events
    prisma.calendarEvent.create({
      data: {
        clientId: maya.id,
        sessionId: sessions[2].id,
        title: "Session — Maya Chen",
        startTime: daysFromNow(1),
        endTime: new Date(daysFromNow(1).getTime() + 60 * 60000),
        googleMeetLink: "https://meet.google.com/abc-defg-hij",
        color: "#8B5CF6",
      },
    }),
    prisma.calendarEvent.create({
      data: {
        clientId: david.id,
        sessionId: sessions[5].id,
        title: "Session — David Okonkwo",
        startTime: daysFromNow(3),
        endTime: new Date(daysFromNow(3).getTime() + 60 * 60000),
        googleMeetLink: "https://meet.google.com/klm-nopq-rst",
        color: "#8B5CF6",
      },
    }),
    // Personal blocks
    prisma.calendarEvent.create({
      data: {
        title: "Personal — Meditation & Journaling",
        startTime: new Date(daysFromNow(0).setHours(7, 0, 0, 0)),
        endTime: new Date(daysFromNow(0).setHours(8, 0, 0, 0)),
        color: "#9CA3AF",
      },
    }),
    prisma.calendarEvent.create({
      data: {
        title: "Supervision Call — Dr. Elaine",
        startTime: new Date(daysFromNow(5).setHours(14, 0, 0, 0)),
        endTime: new Date(daysFromNow(5).setHours(15, 0, 0, 0)),
        color: "#F59E0B",
      },
    }),
  ]);

  console.log("Seed data created successfully!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
