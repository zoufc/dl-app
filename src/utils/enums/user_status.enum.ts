export enum UserStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
}

export enum P2PLoanStatus {
  COMPLETED = 'completed',
  WAITING_FOR_LENDER = 'waiting_for_lender',
  SUSPENDED = 'suspended',
}

export enum P2PReimbourseStatus {
  reimboursed = 'reimboursed',
  waiting = 'wating',
}

export enum TransactionType {
  WAVE = 'wave',
  OM = 'orange_money',
  CARD = 'card',
}

export enum TransactionStatus {
  COMPLETED = 'completed',
  WAITING = 'waiting',
  FAILED = 'failed',
}

export enum TransactionReason {
  recharge_wallet = 'recharge',
  withdraw = 'withdraw',
  loan_invest = 'loan_invest',
  loan_reimbourse = 'loan_reimbourse',
}

export enum PaymentMode {
  wave = 'WAVE',
  om = 'ORANGE_MONEY',
  card = 'CARD',
}

export enum DocumentType {
  cni = 'CNI',
  passport = 'PASSPORT',
}

export enum DocumentStatus {
  pending = 'PENDING',
  approved = 'APPROVED',
  rejected = 'REJECTED',
}
