export interface Network {
  id: string;
  name: string;
  explorerUrl: string;
  nativeCurrency: string;
  decimals: number;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  asset: string;
  timestamp: string;
  blockNumber: string;
  network: string;
  type: "send" | "receive" | "contract" | "unknown";
  status: "confirmed" | "pending" | "failed";
  flagged?: boolean;
}

export interface PersonalDetails {
  fullName: string;
  email: string;
  state: string;
  walletAddress: string;
  network: string;
  incidentDescription: string;
  estimatedLoss: string;
}

export type Agency = "cfpb" | "state_ag" | "sec" | "ftc" | "coinbase_legal";

export interface AgencyInfo {
  id: Agency;
  name: string;
  fullName: string;
  description: string;
}

export interface GeneratedLetter {
  agency: Agency;
  agencyName: string;
  subject: string;
  body: string;
  date: string;
}

export interface TransactionApiResponse {
  transactions: Transaction[];
  nextPageToken?: string;
  error?: string;
}

export interface SessionData {
  walletAddress: string;
  network: string;
  transactions: Transaction[];
  flaggedTransactions: Transaction[];
  personalDetails: PersonalDetails | null;
  selectedAgencies: Agency[];
  generatedLetters: GeneratedLetter[];
}
