"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Rocket, CreditCard, Plus, Trash2 } from "lucide-react";
import { BuyCreditsModal, CardPaymentMethodModal, PaymentOptionsModal, PromptModal } from "@/components/ui/modals";
import { usePaymentStore } from "@/stores";
import { toast } from "sonner"

import { motion } from "framer-motion";


export function BillingContent() {
  const [isPaymentOptionsOpen, setIsPaymentOptionsOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isBuyCreditsOpen, setIsBuyCreditsOpen] = useState(false);

  ;


  const [deletePrompt, setDeletePrompt] = useState<{
    isOpen: boolean;
    methodId: string | null;
  }>({
    isOpen: false,
    methodId: null
  });
  const { paymentMethods, removePaymentMethod } = usePaymentStore();

  const handlePaymentMethodSelect = (method: 'card' | 'link' | 'revolut' | 'paypal') => {
    setIsPaymentOptionsOpen(false);
    if (method === 'card') {
      setIsCardModalOpen(true);
    } else if (method === 'link') {
      setIsLinkModalOpen(true);
    }
  };

  const handleDeletePaymentMethod = (methodId: string) => {
    setDeletePrompt({
      isOpen: true,
      methodId
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Alert */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-backgroundSecondary text-muted-foreground px-6 py-4 rounded-lg mb-8 backdrop-blur-sm border border-borderColorPrimary"
      >
        <p>To get started with the Alle-AI API, purchase some credits.</p>
      </motion.div>

      {/* Credit Balance Section */}
      <div className="mb-12">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-semibold mb-3"
        >
          Credit balance
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground mb-8"
        >
          Your credit balance will be consumed with API and Workbench usage. You can add funds directly or set up auto-reload thresholds.
        </motion.p>

        <div className="grid gap-6">
          {/* Main Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-backgroundSecondary to-background border-borderColorPrimary overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Remaining Balance</p>
                    <span className="text-5xl font-bold tracking-tight">£0.00</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button 
                    className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
                    onClick={() => setIsBuyCreditsOpen(true)}
                  >
                    Add Credits
                  </Button>
                  <Button variant="outline" className="transition-colors">
                    Set up Auto-reload
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-4"
          >
            <Card className="p-6 bg-backgroundSecondary/50 hover:bg-backgroundSecondary transition-colors">
              <p className="text-sm text-muted-foreground mb-2">Monthly Usage</p>
              <p className="text-2xl font-semibold">£0.00</p>
            </Card>
            <Card className="p-6 bg-backgroundSecondary/50 hover:bg-backgroundSecondary transition-colors">
              <p className="text-sm text-muted-foreground mb-2">API Calls</p>
              <p className="text-2xl font-semibold">0</p>
            </Card>
            <Card className="p-6 bg-backgroundSecondary/50 hover:bg-backgroundSecondary transition-colors">
              <p className="text-sm text-muted-foreground mb-2">Active Keys</p>
              <p className="text-2xl font-semibold">0</p>
            </Card>
          </motion.div>

          {/* Payment Methods Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Payment methods</h2>
                <p className="text-muted-foreground">
                  Add a payment method to enable automatic reloading of credits.
                </p>
              </div>
              {paymentMethods.length > 0 && (
                <Button 
                    variant="outline" 
                    className="transition-colors"
                    onClick={() => setIsPaymentOptionsOpen(true)}
                >
                    Add Payment Method
                </Button>
              )}
            </div>

            {paymentMethods.length === 0 ? (
              <Card className="p-8 bg-backgroundSecondary/30 border-dashed border-2 border-borderColorPrimary/50">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">No payment methods</h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-md">
                    Add a payment method to enable automatic payments and ensure uninterrupted access to the API.
                  </p>
                  <Button 
                    variant="outline" 
                    className="transition-colors"
                    onClick={() => setIsPaymentOptionsOpen(true)}
                  >
                    Add Payment Method
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <Card key={method.id} className="p-4 bg-backgroundSecondary">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-backgroundSecondary rounded-full flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">•••• {method.lastFour}</p>
                            {method.isDefault && (
                              <Badge variant="outline" className="text-xs">Default</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Expires {method.expiryDate}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeletePaymentMethod(method.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>

          {/* Enterprise Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="bg-backgroundSecondary/30 border-borderColorPrimary/50 hover:border-primary/20 transition-all">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Rocket className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Need enterprise features?</h3>
                      <p className="text-sm text-muted-foreground">
                        Contact the Anthropic accounts team for custom rate limits, monthly invoicing, and more.
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="hover:bg-primary hover:text-white transition-colors ml-8"
                  >
                    Contact Sales
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <PaymentOptionsModal 
        isOpen={isPaymentOptionsOpen}
        onClose={() => setIsPaymentOptionsOpen(false)}
        onSelectMethod={handlePaymentMethodSelect}
      />
      
      <CardPaymentMethodModal 
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        mode="add"
      />

      <BuyCreditsModal 
        isOpen={isBuyCreditsOpen}
        onClose={() => setIsBuyCreditsOpen(false)}
      />

      {/* Delete Confirmation Prompt */}
      <PromptModal
        isOpen={deletePrompt.isOpen}
        onClose={() => setDeletePrompt({ isOpen: false, methodId: null })}
        title="Remove Payment Method"
        message="Are you sure you want to remove this payment method? This action cannot be undone."
        type="warning"
        actions={[
          {
            label: "Cancel",
            onClick: () => setDeletePrompt({ isOpen: false, methodId: null }),
            variant: "outline"
          },
          {
            label: "Remove",
            onClick: () => {
              if (deletePrompt.methodId) {
                removePaymentMethod(deletePrompt.methodId);
                setDeletePrompt({ isOpen: false, methodId: null });
              }
            },
            variant: "destructive"
          }
        ]}
      />
    </motion.div>
  );
}