"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import type { ContactMessage } from "@/types/database";

export default function AdminMessagesPage() {
  const supabase = createClient();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  }

  async function markAsRead(id: string) {
    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read: true })
      .eq("id", id);

    if (!error) {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_read: true } : m))
      );
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this message?")) return;

    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast({ title: "Deleted", description: "Message deleted." });
    }
  }

  function openMessage(msg: ContactMessage) {
    setSelectedMessage(msg);
    if (!msg.is_read) {
      markAsRead(msg.id);
    }
  }

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Messages</h1>
          {unreadCount > 0 && (
            <Badge className="bg-amber-500 text-black">
              {unreadCount} unread
            </Badge>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Messages ({messages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              No messages yet.
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: idx * 0.03 }}
                    className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
                      !msg.is_read ? "border-satek/30 bg-satek/5" : "border-border"
                    }`}
                    onClick={() => openMessage(msg)}
                  >
                    <div className="flex-shrink-0">
                      {msg.is_read ? (
                        <MailOpen className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Mail className="h-5 w-5 text-satek" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${!msg.is_read ? "text-foreground" : "text-muted-foreground"}`}>
                          {msg.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          &lt;{msg.email}&gt;
                        </span>
                      </div>
                      <p className="text-sm font-medium truncate">{msg.subject}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {msg.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        {formatDate(msg.created_at)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(msg.id);
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Message Detail Dialog */}
      <Dialog
        open={!!selectedMessage}
        onOpenChange={() => setSelectedMessage(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject}</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium">{selectedMessage.name}</span>
                  <span className="text-muted-foreground ml-2">
                    &lt;{selectedMessage.email}&gt;
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDate(selectedMessage.created_at)}
                </span>
              </div>
              <Separator />
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {selectedMessage.message}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
