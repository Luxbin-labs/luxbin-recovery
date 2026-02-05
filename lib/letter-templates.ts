import { Agency, GeneratedLetter, PersonalDetails, Transaction } from "./types";
import { formatDate, todayFormatted, truncateAddress } from "./format-utils";
import { getNetwork } from "./networks";
import { weiToEth } from "./format-utils";

function buildTxTable(transactions: Transaction[]): string {
  let table = "FLAGGED TRANSACTION EVIDENCE\n";
  table += "=".repeat(80) + "\n\n";

  for (let i = 0; i < transactions.length; i++) {
    const tx = transactions[i];
    const network = getNetwork(tx.network);
    const decimals = network?.decimals || 18;
    const amount = weiToEth(tx.value, decimals);

    table += `Transaction #${i + 1}\n`;
    table += `-`.repeat(40) + "\n";
    table += `  Date:        ${formatDate(tx.timestamp)}\n`;
    table += `  Type:        ${tx.type.toUpperCase()}\n`;
    table += `  Amount:      ${amount} ${tx.asset}\n`;
    table += `  From:        ${tx.from}\n`;
    table += `  To:          ${tx.to}\n`;
    table += `  TX Hash:     ${tx.hash}\n`;
    table += `  Network:     ${network?.name || tx.network}\n`;
    table += `  Status:      ${tx.status}\n\n`;
  }

  return table;
}

function cfpbLetter(details: PersonalDetails, flagged: Transaction[]): GeneratedLetter {
  const date = todayFormatted();
  const txTable = buildTxTable(flagged);

  return {
    agency: "cfpb",
    agencyName: "Consumer Financial Protection Bureau (CFPB)",
    subject: "Formal Complaint Regarding Unauthorized Cryptocurrency Transactions on Coinbase",
    date,
    body: `${date}

Consumer Financial Protection Bureau
P.O. Box 4503
Iowa City, Iowa 52244

RE: Formal Complaint - Unauthorized Cryptocurrency Transactions
Coinbase Global, Inc. / Coinbase, Inc.
Wallet Address: ${details.walletAddress}
Network: ${getNetwork(details.network)?.name || details.network}

Dear CFPB Complaint Division:

I, ${details.fullName}, am filing this formal complaint against Coinbase, Inc. regarding unauthorized and/or suspicious transactions originating from or directed to my cryptocurrency wallet. I am a resident of the State of ${details.state}.

STATEMENT OF FACTS:

${details.incidentDescription}

Estimated total loss: ${details.estimatedLoss}

APPLICABLE LAW:

This complaint is filed pursuant to the Electronic Fund Transfer Act (EFTA), 15 U.S.C. Section 1693 et seq., and Regulation E (12 C.F.R. Part 1005), which impose strict obligations on financial institutions regarding unauthorized electronic fund transfers:

1. Under EFTA Section 1693f, Coinbase is required to investigate errors within 10 business days of receiving notice and resolve them within 45 days.

2. Under Regulation E Section 1005.6, consumer liability for unauthorized transfers is limited to $50 if reported within 2 business days, and $500 if reported within 60 days.

3. Coinbase, as a money services business registered with FinCEN and holding state money transmitter licenses, is subject to these federal consumer protection requirements.

4. The Consumer Financial Protection Act (12 U.S.C. Section 5531) prohibits unfair, deceptive, or abusive acts or practices (UDAAP) in connection with consumer financial products.

${txTable}

REQUESTED RELIEF:

1. Investigation of all flagged transactions listed above
2. Full reimbursement of unauthorized transaction amounts
3. Freezing of receiving addresses to prevent further unauthorized transfers
4. Written explanation from Coinbase of their investigation findings
5. Implementation of enhanced security measures on my account

I have attempted to resolve this matter directly with Coinbase but have been unable to obtain satisfactory resolution. I respectfully request the CFPB investigate this matter and take appropriate enforcement action.

Contact Information:
Name: ${details.fullName}
Email: ${details.email}
State: ${details.state}

Respectfully submitted,

${details.fullName}`,
  };
}

function stateAgLetter(details: PersonalDetails, flagged: Transaction[]): GeneratedLetter {
  const date = todayFormatted();
  const txTable = buildTxTable(flagged);

  return {
    agency: "state_ag",
    agencyName: `${details.state} State Attorney General`,
    subject: "Consumer Protection Complaint - Unauthorized Cryptocurrency Transactions",
    date,
    body: `${date}

Office of the Attorney General
State of ${details.state}
Consumer Protection Division

RE: Consumer Protection Complaint Against Coinbase, Inc.
Unauthorized Cryptocurrency Transactions
Wallet Address: ${details.walletAddress}

Dear Attorney General's Consumer Protection Division:

I, ${details.fullName}, a resident of ${details.state}, respectfully submit this consumer protection complaint against Coinbase, Inc. (Coinbase Global, Inc.) for failing to adequately protect my cryptocurrency assets and for potential violations of state consumer protection laws.

BACKGROUND:

Coinbase, Inc. operates as a cryptocurrency exchange and custodial service, holding state money transmitter licenses across the United States. As such, they are subject to the consumer protection laws of the State of ${details.state}.

STATEMENT OF FACTS:

${details.incidentDescription}

Estimated total loss: ${details.estimatedLoss}

LEGAL BASIS:

1. STATE CONSUMER PROTECTION ACT: Coinbase's failure to protect consumer assets and adequately respond to reports of unauthorized transactions constitutes an unfair and deceptive business practice under ${details.state} consumer protection statutes.

2. MONEY TRANSMITTER REGULATIONS: As a licensed money transmitter in ${details.state}, Coinbase is subject to state regulatory requirements including adequate safeguarding of consumer funds and prompt investigation of unauthorized transactions.

3. BREACH OF FIDUCIARY DUTY: Coinbase's custody of consumer digital assets creates fiduciary obligations that were breached when unauthorized transactions were permitted to occur.

4. NEGLIGENCE: Coinbase failed to implement adequate security measures to prevent unauthorized access to consumer accounts and/or wallets.

${txTable}

REQUESTED RELIEF:

1. Investigation of Coinbase's business practices regarding consumer fund protection
2. Restitution of all losses resulting from unauthorized transactions
3. Injunctive relief requiring Coinbase to implement enhanced security measures
4. Civil penalties as permitted under state consumer protection laws
5. Any additional relief deemed appropriate by the Attorney General

I authorize the Attorney General's office to contact me regarding this complaint and to share information with other regulatory agencies as necessary.

Contact Information:
Name: ${details.fullName}
Email: ${details.email}
State: ${details.state}

Respectfully submitted,

${details.fullName}`,
  };
}

function secLetter(details: PersonalDetails, flagged: Transaction[]): GeneratedLetter {
  const date = todayFormatted();
  const txTable = buildTxTable(flagged);

  return {
    agency: "sec",
    agencyName: "U.S. Securities and Exchange Commission (SEC)",
    subject: "Complaint Regarding Potential Securities Fraud and Unauthorized Digital Asset Transactions",
    date,
    body: `${date}

U.S. Securities and Exchange Commission
Office of Investor Education and Advocacy
100 F Street, NE
Washington, DC 20549

RE: Complaint - Potential Securities Fraud / Unauthorized Digital Asset Transactions
Coinbase Global, Inc. (NASDAQ: COIN)
Wallet Address: ${details.walletAddress}

Dear SEC Office of Investor Education and Advocacy:

I, ${details.fullName}, am submitting this complaint regarding unauthorized and/or suspicious transactions involving digital assets on the Coinbase platform, which may constitute violations of federal securities laws.

STATEMENT OF FACTS:

${details.incidentDescription}

Estimated total loss: ${details.estimatedLoss}

POTENTIAL SECURITIES LAW VIOLATIONS:

1. SECURITIES EXCHANGE ACT OF 1934, Section 10(b) and Rule 10b-5: The unauthorized movement of digital assets, some of which may constitute securities under the Howey test, potentially involves fraud and manipulation in connection with the purchase or sale of securities.

2. SECURITIES ACT OF 1933, Section 17(a): Prohibits fraud in the offer or sale of securities, including digital asset securities.

3. INVESTMENT ADVISERS ACT OF 1940: To the extent Coinbase provides investment advice or manages digital asset portfolios, unauthorized transactions may violate fiduciary duties.

4. REGULATION SHO / MARKET MANIPULATION: Patterns of unauthorized transactions may indicate market manipulation schemes designed to artificially affect digital asset prices.

${txTable}

REQUESTED ACTION:

1. Investigation of the flagged transactions for potential securities law violations
2. Examination of Coinbase's internal controls and compliance procedures
3. Enforcement action against any parties found to have violated securities laws
4. Coordination with FinCEN and state regulators as appropriate
5. Whistleblower protection for the complainant under the Dodd-Frank Act

I am willing to cooperate fully with any investigation and provide additional information as needed.

Contact Information:
Name: ${details.fullName}
Email: ${details.email}
State: ${details.state}

Respectfully submitted,

${details.fullName}`,
  };
}

function ftcLetter(details: PersonalDetails, flagged: Transaction[]): GeneratedLetter {
  const date = todayFormatted();
  const txTable = buildTxTable(flagged);

  return {
    agency: "ftc",
    agencyName: "Federal Trade Commission (FTC)",
    subject: "Complaint Regarding Unfair and Deceptive Practices - Coinbase Cryptocurrency Platform",
    date,
    body: `${date}

Federal Trade Commission
Consumer Response Center
600 Pennsylvania Avenue, NW
Washington, DC 20580

RE: Complaint - Unfair and Deceptive Trade Practices
Coinbase, Inc. / Coinbase Global, Inc.
Wallet Address: ${details.walletAddress}

Dear FTC Consumer Response Center:

I, ${details.fullName}, a resident of ${details.state}, am filing this complaint against Coinbase, Inc. for unfair and deceptive trade practices in connection with cryptocurrency transactions on their platform.

STATEMENT OF FACTS:

${details.incidentDescription}

Estimated total loss: ${details.estimatedLoss}

LEGAL BASIS:

1. FTC ACT, SECTION 5 (15 U.S.C. Section 45): Coinbase has engaged in unfair and deceptive acts or practices in or affecting commerce by:
   a) Failing to adequately protect consumer digital assets despite representing that their platform is secure
   b) Failing to promptly investigate and resolve reports of unauthorized transactions
   c) Making misleading representations about the security of their custody services

2. UNFAIR PRACTICES: Under the FTC's unfairness standard, Coinbase's conduct causes substantial injury to consumers that is not reasonably avoidable and is not outweighed by countervailing benefits to consumers or competition.

3. DECEPTIVE PRACTICES: Coinbase's marketing materials and user agreements contain representations about security and asset protection that are contradicted by their actual practices.

4. GRAMM-LEACH-BLILEY ACT: As a financial institution, Coinbase is subject to the FTC's Safeguards Rule requiring adequate protection of customer information and assets.

${txTable}

REQUESTED RELIEF:

1. Investigation of Coinbase's security practices and consumer protection measures
2. Enforcement action for unfair and deceptive trade practices
3. Mandatory consumer restitution for losses due to unauthorized transactions
4. Injunctive relief requiring enhanced security and transparency measures
5. Civil penalties as permitted under Section 5 of the FTC Act

Contact Information:
Name: ${details.fullName}
Email: ${details.email}
State: ${details.state}

Respectfully submitted,

${details.fullName}`,
  };
}

function coinbaseLegalLetter(details: PersonalDetails, flagged: Transaction[]): GeneratedLetter {
  const date = todayFormatted();
  const txTable = buildTxTable(flagged);

  return {
    agency: "coinbase_legal",
    agencyName: "Coinbase Legal Department",
    subject: "DEMAND LETTER - Unauthorized Transactions and Request for Immediate Account Action",
    date,
    body: `${date}

VIA EMAIL AND CERTIFIED MAIL

Coinbase, Inc.
Legal Department
248 3rd Street, #434
Oakland, CA 94607
legal@coinbase.com

RE: DEMAND FOR INVESTIGATION AND REIMBURSEMENT
Unauthorized Transactions - Immediate Action Required
Wallet Address: ${details.walletAddress}
Network: ${getNetwork(details.network)?.name || details.network}

Dear Coinbase Legal Department:

This letter serves as formal notice and demand regarding unauthorized and/or suspicious transactions affecting my Coinbase account/wallet. I, ${details.fullName}, am demanding immediate investigation and full reimbursement pursuant to the Coinbase User Agreement and applicable law.

STATEMENT OF FACTS:

${details.incidentDescription}

Estimated total loss: ${details.estimatedLoss}

${txTable}

CONTRACTUAL OBLIGATIONS:

Pursuant to the Coinbase User Agreement, Coinbase has the following obligations:

1. SECURITY OBLIGATION: Section 3 of the User Agreement requires Coinbase to maintain commercially reasonable security measures to protect user accounts and assets.

2. UNAUTHORIZED TRANSACTION POLICY: Coinbase's terms require investigation of reported unauthorized transactions and, where appropriate, reimbursement of losses.

3. DISPUTE RESOLUTION: The User Agreement provides for dispute resolution procedures that must be followed in good faith.

4. REGULATORY COMPLIANCE: As a registered Money Services Business (MSB) with FinCEN and licensed money transmitter, Coinbase must comply with all applicable federal and state regulations regarding consumer protection.

DEMANDS:

I hereby demand that Coinbase:

1. IMMEDIATELY freeze and investigate all flagged transactions listed above
2. Provide a COMPLETE transaction log for my wallet address within 10 business days
3. REIMBURSE the full amount of all unauthorized transactions within 30 days
4. Provide a WRITTEN EXPLANATION of how unauthorized transactions were permitted to occur
5. Implement ENHANCED SECURITY MEASURES on my account to prevent future unauthorized access
6. PRESERVE all records related to my account and the flagged transactions

NOTICE OF REGULATORY COMPLAINTS:

Please be advised that I have filed or intend to file complaints with:
- Consumer Financial Protection Bureau (CFPB)
- Federal Trade Commission (FTC)
- Securities and Exchange Commission (SEC)
- ${details.state} State Attorney General

LEGAL NOTICE:

If Coinbase fails to respond to this demand within 30 days and provide full restitution, I reserve the right to pursue all available legal remedies, including but not limited to:
- Arbitration pursuant to the User Agreement
- Class action litigation (to the extent permitted)
- Regulatory enforcement actions
- Public disclosure of Coinbase's failure to protect consumer assets

Time is of the essence in this matter. I expect a written acknowledgment of this demand within 5 business days.

Contact Information:
Name: ${details.fullName}
Email: ${details.email}
State: ${details.state}

Very truly yours,

${details.fullName}

cc: Consumer Financial Protection Bureau
    ${details.state} Attorney General
    Federal Trade Commission`,
  };
}

const GENERATORS: Record<Agency, (details: PersonalDetails, flagged: Transaction[]) => GeneratedLetter> = {
  cfpb: cfpbLetter,
  state_ag: stateAgLetter,
  sec: secLetter,
  ftc: ftcLetter,
  coinbase_legal: coinbaseLegalLetter,
};

export function generateLetter(
  agency: Agency,
  details: PersonalDetails,
  flaggedTransactions: Transaction[]
): GeneratedLetter {
  const generator = GENERATORS[agency];
  if (!generator) throw new Error(`Unknown agency: ${agency}`);
  return generator(details, flaggedTransactions);
}

export function generateAllLetters(
  agencies: Agency[],
  details: PersonalDetails,
  flaggedTransactions: Transaction[]
): GeneratedLetter[] {
  return agencies.map((agency) => generateLetter(agency, details, flaggedTransactions));
}

export const AGENCY_INFO = [
  {
    id: "cfpb" as Agency,
    name: "CFPB",
    fullName: "Consumer Financial Protection Bureau",
    description: "Federal agency protecting consumers in financial markets. Cites EFTA/Reg E, 60-day error resolution.",
  },
  {
    id: "state_ag" as Agency,
    name: "State AG",
    fullName: "State Attorney General",
    description: "Your state's consumer protection division. Cites state consumer protection laws.",
  },
  {
    id: "sec" as Agency,
    name: "SEC",
    fullName: "Securities and Exchange Commission",
    description: "Federal securities regulator. Cites Securities Exchange Act, Rule 10b-5.",
  },
  {
    id: "ftc" as Agency,
    name: "FTC",
    fullName: "Federal Trade Commission",
    description: "Federal consumer protection agency. Cites FTC Act Section 5, unfair/deceptive practices.",
  },
  {
    id: "coinbase_legal" as Agency,
    name: "Coinbase Legal",
    fullName: "Coinbase Legal Department",
    description: "Direct demand letter to Coinbase citing User Agreement. Demands freeze + reimbursement.",
  },
];
