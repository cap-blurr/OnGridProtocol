import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  RefreshCw,
  Circle,
  ExternalLink,
  Clock,
  CheckCircle2,
  ArrowRight,
  Coins
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
// Define Transaction interface locally since it's now part of useDashboardData
interface Transaction {
  id: string;
  type: 'investment' | 'withdrawal' | 'repayment' | 'claim';
  amount: string;
  projectName: string;
  timestamp: number;
  status: 'completed' | 'pending' | 'failed';
  transactionHash: string;
  blockNumber: string; // Changed from bigint to string to avoid JSON serialization issues
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
  className?: string;
}

export function TransactionList({ 
  transactions, 
  maxItems = 5, 
  showDetails = true, 
  title = "Recent Transactions",
  className = ""
}: TransactionListProps) {
  const displayTransactions = transactions.slice(0, maxItems);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'investment':
        return <ArrowUpRight className="h-4 w-4" />;
      case 'withdrawal':
        return <ArrowDownLeft className="h-4 w-4" />;
      case 'repayment':
        return <Coins className="h-4 w-4" />;
      case 'claim':
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <ArrowUpRight className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'investment':
        return 'text-[#4CAF50]';
      case 'withdrawal':
        return 'text-orange-400';
      case 'repayment':
        return 'text-blue-400';
      case 'claim':
        return 'text-[#4CAF50]';
      default:
        return 'text-[#4CAF50]';
    }
  };

  const getTransactionBg = (type: string) => {
    switch (type) {
      case 'investment':
        return 'bg-[#4CAF50]/10 border-[#4CAF50]/20';
      case 'withdrawal':
        return 'bg-orange-500/10 border-orange-500/20';
      case 'repayment':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'claim':
        return 'bg-[#4CAF50]/10 border-[#4CAF50]/20';
      default:
        return 'bg-[#4CAF50]/10 border-[#4CAF50]/20';
    }
  };

  if (displayTransactions.length === 0) {
    return (
      <Card className={`bg-black/40 backdrop-blur-sm border border-[#4CAF50]/30 ${className}`}>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#4CAF50]" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 mx-auto mb-4 text-zinc-600" />
            <h3 className="text-lg font-semibold text-white mb-2">No Transactions Yet</h3>
            <p className="text-zinc-400 text-sm">
              Your transaction history will appear here once you start investing.
            </p>
            <Link href="/dashboard/investments/pools">
              <Button className="mt-4 bg-[#4CAF50] hover:bg-[#4CAF50]/80 text-black">
                Start Investing
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-black/40 backdrop-blur-sm border border-[#4CAF50]/30 hover:border-[#4CAF50]/50 transition-colors ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="h-5 w-5 text-[#4CAF50]" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className={`flex items-center justify-between p-3 rounded-lg border ${getTransactionBg(transaction.type)} hover:bg-opacity-20 transition-colors`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full bg-black/20 ${getTransactionColor(transaction.type)}`}>
                {getTransactionIcon(transaction.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white font-medium text-sm">
                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                  </p>
                  <Badge className="bg-[#4CAF50]/20 text-[#4CAF50] border-[#4CAF50]/50 text-xs">
                    {transaction.status}
                  </Badge>
                </div>
                <p className="text-zinc-400 text-xs">{transaction.projectName}</p>
                <p className="text-zinc-500 text-xs">
                  {formatDistanceToNow(new Date(transaction.timestamp * 1000), { addSuffix: true })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold text-sm ${getTransactionColor(transaction.type)}`}>
                ${transaction.amount}
              </p>
              {showDetails && (
                <button
                  onClick={() => window.open(`https://sepolia.basescan.org/tx/${transaction.transactionHash}`, '_blank')}
                  className="text-zinc-400 hover:text-[#4CAF50] transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        ))}
        
        {transactions.length > maxItems && (
          <div className="pt-3 border-t border-[#4CAF50]/20">
            <Link href="/dashboard/investments/current">
              <Button variant="ghost" className="w-full justify-center text-zinc-400 hover:text-[#4CAF50] hover:bg-[#4CAF50]/5">
                View all transactions 
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 