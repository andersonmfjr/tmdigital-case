export interface CreditAnalysis {
  id: string;
  requestDate: Date;
  status: CreditAnalysisStatus;
  finishDate?: Date;
  rejectionReason?: string;
  approvedAmount?: number;
}

export type CreditAnalysisStatus = 'PENDING' | 'APPROVED' | 'REJECTED';