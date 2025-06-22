import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  RefreshCw,
  Circle,
  ExternalLink,
  Clock
} from 'lucide-react';
// Define Transaction interface locally since it's now part of useDashboardData
interface Transaction {
  id: string;
  type: 'investment' | 'withdrawal' | 'repayment' | 'claim';
  amount: string;
  projectName: string;
  timestamp: number;
  status: 'completed' | 'pending' | 'failed';
  transactionHash: string;
  blockNumber: bigint;
  description: string;
}

interface TransactionDetailsProps {
  transaction: Transaction;
  showDetails?: boolean;
}

export function TransactionDetails({ transaction, showDetails = false }: TransactionDetailsProps) {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'investment': 
        return <ArrowUpRight className="h-4 w-4 text-oga-green" />;
      case 'withdrawal': 
        return <ArrowDownLeft className="h-4 w-4 text-oga-yellow" />;
      case 'claim': 
        return <DollarSign className="h-4 w-4 text-blue-400" />;
      case 'repayment': 
        return <RefreshCw className="h-4 w-4 text-purple-400" />;
      default: 
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'investment': 
        return 'bg-oga-green/20 text-oga-green border-oga-green/50';
      case 'withdrawal': 
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'claim': 
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'repayment': 
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      default: 
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: string) => {
    return `$${Number(amount).toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  if (showDetails) {
    return (
      <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/20 hover:border-oga-green/40 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-start justify-between space-x-4">
            <div className="flex items-start space-x-3 flex-1">
              <div className="p-2 rounded-lg bg-black/60 border border-oga-green/30">
                {getTransactionIcon(transaction.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-medium truncate">
                    {transaction.projectName}
                  </h3>
                  <Badge className={`text-xs ${getTypeColor(transaction.type)}`}>
                    {transaction.type}
                  </Badge>
                </div>
                <p className="text-sm text-zinc-400 mb-2">
                  {transaction.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(transaction.timestamp)}
                  </div>
                  <button
                    onClick={() => window.open(`https://sepolia.basescan.org/tx/${transaction.transactionHash}`, '_blank')}
                    className="flex items-center gap-1 hover:text-oga-green transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View on Explorer
                  </button>
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-white font-semibold text-lg">
                {formatAmount(transaction.amount)}
              </div>
              <Badge className="text-xs bg-oga-green/20 text-oga-green border-oga-green/50">
                {transaction.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 border border-oga-green/20 rounded-lg hover:border-oga-green/40 transition-colors">
      <div className="flex items-center space-x-3">
        {getTransactionIcon(transaction.type)}
        <div>
          <p className="text-white font-medium">{transaction.projectName}</p>
          <p className="text-xs text-zinc-400">
            {formatDate(transaction.timestamp)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-white font-medium">{formatAmount(transaction.amount)}</p>
        <Badge className={`text-xs ${getTypeColor(transaction.type)}`}>
          {transaction.type}
        </Badge>
      </div>
    </div>
  );
}

interface TransactionListProps {
  transactions: Transaction[];
  maxItems?: number;
  showDetails?: boolean;
  title?: string;
}

export function TransactionList({ 
  transactions, 
  maxItems = 5, 
  showDetails = false,
  title = "Recent Transactions"
}: TransactionListProps) {
  const displayTransactions = transactions.slice(0, maxItems);

  if (transactions.length === 0) {
    return (
      <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
        <CardContent className="py-8 text-center">
          <Circle className="h-12 w-12 mx-auto mb-4 text-zinc-600" />
          <h3 className="text-lg font-semibold text-white mb-2">No Transactions Yet</h3>
          <p className="text-zinc-400">
            Your transaction history will appear here once you start investing.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      )}
      <div className={showDetails ? "space-y-4" : "space-y-3"}>
        {displayTransactions.map((transaction) => (
          <TransactionDetails
            key={transaction.id}
            transaction={transaction}
            showDetails={showDetails}
          />
        ))}
      </div>
      {transactions.length > maxItems && (
        <div className="text-center pt-2">
          <p className="text-sm text-zinc-400">
            Showing {maxItems} of {transactions.length} transactions
          </p>
        </div>
      )}
    </div>
  );
} 