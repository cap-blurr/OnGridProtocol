'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
  Zap,
  FileCheck,
  TrendingUp,
  ExternalLink,
  X,
  Trash2,
  Settings,
  Filter,
  RefreshCw
} from 'lucide-react';
import { formatUnits } from 'viem';
import toast from 'react-hot-toast';

// Import contract event hooks
import { 
  useAllContractEvents, 
  useUserEvents,
  useProjectFactoryEvents,
  useRepaymentEvents,
  useDeveloperRegistryEvents 
} from '@/hooks/contracts/useContractEvents';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  category: 'project' | 'repayment' | 'kyc' | 'funding' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  actionUrl?: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  relatedProjectId?: number;
  transactionHash?: string;
}

interface NotificationCenterProps {
  developerAddress?: `0x${string}`;
}

export default function NotificationCenter({ developerAddress }: NotificationCenterProps) {
  const { address: userAddress, isConnected } = useAccount();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState(false);

  // Get user-specific contract events
  const { events: userEvents } = useUserEvents(userAddress);
  const { events: projectEvents } = useProjectFactoryEvents();
  const { events: repaymentEvents } = useRepaymentEvents();
  const { events: registryEvents } = useDeveloperRegistryEvents();

  // Process contract events into notifications
  useEffect(() => {
    if (!userAddress || !isConnected) return;

    const processedNotifications: Notification[] = [];

    // Process user-specific events
    userEvents.forEach((event) => {
      let notification: Notification | null = null;

      switch (event.type) {
        case 'ProjectCreated':
          notification = {
            id: `project-${event.transactionHash}`,
            type: 'success',
            category: 'project',
            title: 'Project Created Successfully!',
            message: `Your solar project #${event.data?.projectId} has been created and is ready for funding.`,
            timestamp: new Date(event.timestamp),
            isRead: false,
            priority: 'high',
            relatedProjectId: Number(event.data?.projectId),
            transactionHash: event.transactionHash,
            actionUrl: `/developer-dashboard/projects/${event.data?.projectId}`
          };
          break;

        case 'LowValueProjectSubmitted':
          notification = {
            id: `pool-project-${event.transactionHash}`,
            type: event.data?.success ? 'success' : 'info',
            category: 'funding',
            title: event.data?.success ? 'Pool Project Funded!' : 'Project Submitted to Pool',
            message: event.data?.success 
              ? `Your low-value project #${event.data?.projectId} has been successfully funded from the liquidity pool.`
              : `Your project #${event.data?.projectId} has been submitted and is awaiting pool funding.`,
            timestamp: new Date(event.timestamp),
            isRead: false,
            priority: event.data?.success ? 'high' : 'medium',
            relatedProjectId: Number(event.data?.projectId),
            transactionHash: event.transactionHash
          };
          break;

        case 'RepaymentRouted':
          const repaymentAmount = event.data?.totalAmountRepaid 
            ? Number(formatUnits(event.data.totalAmountRepaid, 6)).toLocaleString()
            : '0';
          notification = {
            id: `repayment-${event.transactionHash}`,
            type: 'success',
            category: 'repayment',
            title: 'Loan Repayment Processed',
            message: `Your repayment of $${repaymentAmount} for project #${event.data?.projectId} has been successfully processed.`,
            timestamp: new Date(event.timestamp),
            isRead: false,
            priority: 'medium',
            relatedProjectId: Number(event.data?.projectId),
            transactionHash: event.transactionHash,
            actionUrl: '/developer-dashboard/repayment'
          };
          break;

        case 'KYCStatusChanged':
          notification = {
            id: `kyc-${event.transactionHash}`,
            type: event.data?.isVerified ? 'success' : 'warning',
            category: 'kyc',
            title: event.data?.isVerified ? 'KYC Verification Approved!' : 'KYC Status Updated',
            message: event.data?.isVerified
              ? 'Your KYC verification has been approved. You can now create projects.'
              : 'Your KYC verification status has been updated. Please check your dashboard.',
            timestamp: new Date(event.timestamp),
            isRead: false,
            priority: 'high',
            transactionHash: event.transactionHash,
            actionUrl: '/developer-dashboard/kyc'
          };
          break;

        case 'DepositFunded':
          const depositAmount = event.data?.amount 
            ? Number(formatUnits(event.data.amount, 6)).toLocaleString()
            : '0';
          notification = {
            id: `deposit-${event.transactionHash}`,
            type: 'success',
            category: 'project',
            title: 'Developer Deposit Confirmed',
            message: `Your 20% deposit of $${depositAmount} for project #${event.data?.projectId} has been confirmed.`,
            timestamp: new Date(event.timestamp),
            isRead: false,
            priority: 'medium',
            relatedProjectId: Number(event.data?.projectId),
            transactionHash: event.transactionHash
          };
          break;

        case 'DepositReleased':
          const releaseAmount = event.data?.amount 
            ? Number(formatUnits(event.data.amount, 6)).toLocaleString()
            : '0';
          notification = {
            id: `deposit-release-${event.transactionHash}`,
            type: 'success',
            category: 'repayment',
            title: 'Developer Deposit Released',
            message: `Your deposit of $${releaseAmount} for project #${event.data?.projectId} has been released back to your wallet.`,
            timestamp: new Date(event.timestamp),
            isRead: false,
            priority: 'medium',
            relatedProjectId: Number(event.data?.projectId),
            transactionHash: event.transactionHash
          };
          break;
      }

      if (notification) {
        processedNotifications.push(notification);
      }
    });

    // Add some mock system notifications for demonstration
    const mockSystemNotifications: Notification[] = [
      {
        id: 'system-1',
        type: 'info',
        category: 'system',
        title: 'Platform Update Available',
        message: 'New features for carbon credit tokenization are now available.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isRead: false,
        priority: 'low'
      },
      {
        id: 'system-2',
        type: 'warning',
        category: 'system',
        title: 'Scheduled Maintenance',
        message: 'Platform maintenance scheduled for this weekend. No impact on your projects.',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        isRead: true,
        priority: 'medium'
      }
    ];

    // Combine and sort notifications by timestamp
    const allNotifications = [...processedNotifications, ...mockSystemNotifications]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 50); // Limit to 50 most recent

    setNotifications(allNotifications);
    setUnreadCount(allNotifications.filter(n => !n.isRead).length);
  }, [userEvents, userAddress, isConnected]);

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    setUnreadCount(0);
  };

  // Delete notification
  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.isRead) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  // Filter notifications by category
  const filteredNotifications = selectedCategory === 'all'
    ? notifications
    : notifications.filter(n => n.category === selectedCategory);

  // Get notification icon and color
  const getNotificationIcon = (type: string, category: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        switch (category) {
          case 'repayment':
            return <DollarSign className="h-5 w-5 text-blue-400" />;
          case 'project':
            return <Zap className="h-5 w-5 text-emerald-400" />;
          case 'kyc':
            return <FileCheck className="h-5 w-5 text-purple-400" />;
          case 'funding':
            return <TrendingUp className="h-5 w-5 text-oga-green" />;
          default:
            return <Bell className="h-5 w-5 text-zinc-400" />;
        }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      default:
        return 'border-l-blue-500';
    }
  };

  if (!isConnected) {
    return (
      <div className="p-4 text-center">
        <Bell className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
        <p className="text-zinc-400">Connect wallet to view notifications</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Notification Header */}
      <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-oga-green" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="text-oga-green border-oga-green/30 hover:bg-oga-green/20"
              >
                Mark All Read
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-oga-green border-oga-green/30 hover:bg-oga-green/20"
              >
                {isExpanded ? 'Collapse' : 'Expand'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="space-y-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {['all', 'project', 'funding', 'repayment', 'kyc', 'system'].map((category) => (
                <Button
                  key={category}
                  size="sm"
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category 
                    ? 'bg-oga-green text-white' 
                    : 'text-zinc-400 border-zinc-700 hover:border-oga-green/50'
                  }
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>

            {/* Notification List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 mx-auto mb-3 text-zinc-600" />
                  <p className="text-zinc-400">No notifications in this category</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border-l-4 ${getPriorityColor(notification.priority)} ${
                      notification.isRead 
                        ? 'bg-black/20 border-zinc-800' 
                        : 'bg-oga-green/5 border-oga-green/30'
                    } transition-all duration-200`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getNotificationIcon(notification.type, notification.category)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`text-sm font-medium ${
                              notification.isRead ? 'text-zinc-300' : 'text-white'
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 rounded-full bg-oga-green"></div>
                            )}
                          </div>
                          <p className={`text-sm ${
                            notification.isRead ? 'text-zinc-500' : 'text-zinc-400'
                          }`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                            <span>{notification.timestamp.toLocaleString()}</span>
                            {notification.relatedProjectId && (
                              <span>Project #{notification.relatedProjectId}</span>
                            )}
                            {notification.transactionHash && (
                              <button
                                onClick={() => window.open(
                                  `https://sepolia.basescan.org/tx/${notification.transactionHash}`,
                                  '_blank'
                                )}
                                className="flex items-center gap-1 text-oga-green hover:text-oga-green-light"
                              >
                                View Tx <ExternalLink className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {!notification.isRead && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead(notification.id)}
                            className="text-oga-green hover:bg-oga-green/20 p-1 h-auto"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-400 hover:bg-red-500/20 p-1 h-auto"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {notification.actionUrl && (
                      <div className="mt-3">
                        <Button
                          size="sm"
                          onClick={() => window.location.href = notification.actionUrl!}
                          className="bg-oga-green/20 text-oga-green border-oga-green/30 hover:bg-oga-green/30"
                        >
                          View Details
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Quick Stats */}
      {unreadCount > 0 && !isExpanded && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['project', 'funding', 'repayment', 'kyc'].map((category) => {
            const categoryCount = notifications.filter(
              n => n.category === category && !n.isRead
            ).length;
            
            if (categoryCount === 0) return null;

            return (
              <Card key={category} className="bg-black/20 border border-oga-green/20">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400 capitalize">{category}</span>
                    <Badge className="bg-red-500 text-white text-xs">
                      {categoryCount}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
} 