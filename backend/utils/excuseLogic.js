// backend/utils/excuseLogic.js

// Base excuse data (rule-based "AI" source)
const excusesData = {
  Work: [
    "I'm not feeling well today.",
    "There's a family emergency I need to attend to.",
    "My internet connection is down due to maintenance."
  ],
  School: [
    "I have a doctor's appointment.",
    "I'm experiencing severe headaches.",
    "There was a power outage at home."
  ],
  Social: [
    "I'm stuck in traffic.",
    "I have an urgent work deadline.",
    "My pet is unwell and needs attention."
  ],
  Family: [
    "I need to help a relative with an emergency.",
    "Unexpected guests arrived at home.",
    "I'm taking care of a sick family member."
  ]
};

// Choose a random excuse based on scenario + urgency
function generateExcuse(scenario, urgency = "normal") {
  const options = excusesData[scenario];
  if (!options || options.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * options.length);
  let excuse = options[randomIndex];

  if (urgency === "urgent") {
    excuse = "URGENT: " + excuse;
  }

  return excuse;
}

// -------- PROFESSIONAL CERTIFICATE TEXT --------
function generateProof(excuse, scenario, userName = "the user") {
  const now = new Date();
  const formatted = now.toLocaleString("en-IN", {
    dateStyle: "long",
    timeStyle: "short"
  });

  let contextLine = "";
  let heading = "CERTIFICATE OF ABSENCE";

  switch (scenario) {
    case "Work":
      heading = "WORKPLACE ABSENCE CERTIFICATE";
      contextLine =
        `This is to formally certify that ${userName} was unable to attend their official duties at work on the stated date.`;
      break;
    case "School":
      heading = "STUDENT ABSENCE CERTIFICATE";
      contextLine =
        `This is to formally certify that ${userName} was unable to attend classes / academic activities on the stated date.`;
      break;
    case "Social":
      heading = "CONFIRMATION OF NON-ATTENDANCE (SOCIAL EVENT)";
      contextLine =
        `This is to formally confirm that ${userName} was unable to attend the scheduled social engagement or event on the stated date.`;
      break;
    case "Family":
      heading = "FAMILY ENGAGEMENT ABSENCE CERTIFICATE";
      contextLine =
        `This is to formally confirm that ${userName} was unable to be present for the planned family engagement on the stated date.`;
      break;
    default:
      contextLine =
        `This is to certify that ${userName} was unable to be present for the stated obligation on the given date.`;
  }

  return `${heading}

This is to certify that ${userName} was unable to attend ${
    scenario ? scenario.toLowerCase() + "-related" : ""
  } responsibilities due to genuine and unavoidable circumstances.

${contextLine}

REASON FOR ABSENCE
"${excuse}"

The above reason has been submitted in good faith by ${userName} and may be treated
as an official explanation for their absence on the concerned date.

This certificate is issued on request of ${userName} for the purpose of
formal record and/or submission to the appropriate authority.

Date & Time of Issue : ${formatted}

Signature of Concerned Authority : ______________________
Name of Concerned Authority       : ______________________
Designation                       : ______________________
Contact Details                   : ______________________
`;
}


// Scenario-aware apology text
function generateApology(scenario) {
  switch (scenario) {
    case "Work":
      return "I sincerely apologize for any inconvenience caused by my absence at work. I remain committed to fulfilling my responsibilities and will ensure pending tasks are completed at the earliest.";
    case "School":
      return "I apologize for missing class and any disruption it may have caused. I will make sure to catch up on the missed lessons and complete all pending work.";
    case "Social":
      return "I’m really sorry I couldn’t make it to the event. I value our time together and hope we can meet again soon.";
    case "Family":
      return "I apologize for not being able to be present with the family. I truly value our time together and hope for your understanding.";
    default:
      return "I apologize for any inconvenience caused by my absence and appreciate your understanding.";
  }
}

// Simple prediction of next excuse time (last + 3 days)
function predictNextTime(lastDate) {
  const last = new Date(lastDate);
  const next = new Date(last.getTime() + 3 * 24 * 60 * 60 * 1000);
  return next.toLocaleString("en-IN", {
    dateStyle: "long",
    timeStyle: "short"
  });
}

module.exports = {
  generateExcuse,
  generateProof,
  generateApology,
  predictNextTime
};
