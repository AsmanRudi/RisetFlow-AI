import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, Platform, Modal, ScrollView, TextInput } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Shield, User, Trash2, Edit3, X, MessageSquare, Clock } from 'lucide-react-native';
import { SPACING, COLORS } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';

const BACKEND_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export default function AdminDashboard() {
  const { token, user: currentUser } = useAuthStore();
  const { theme } = useAppStore();
  const isDark = theme === 'dark';
  
  const [activeTab, setActiveTab] = useState<'users' | 'alerts' | 'transactions'>('users');
  const [loading, setLoading] = useState(true);
  
  const [users, setUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  // User Detail Modal State
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messageText, setMessageText] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  // Edit Alert Modal State
  const [editingAlert, setEditingAlert] = useState<any>(null);
  const [editAlertText, setEditAlertText] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    if (activeTab === 'users') await fetchUsers();
    else if (activeTab === 'transactions') await fetchTransactions();
    else if (activeTab === 'alerts') await fetchAlerts();
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/users`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setUsers(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/transactions`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setTransactions(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/alerts`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setAlerts(await res.json());
    } catch (e) { console.error(e); }
  };

  // --- User Actions ---
  const updateUser = async (id: string, updates: any) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        fetchUsers();
        if (selectedUser && selectedUser.id === id) {
          setSelectedUser({ ...selectedUser, ...updates });
        }
      }
    } catch (e) { console.error(e); }
  };

  const deleteUser = async (id: string) => {
    Alert.alert('Hapus Pengguna', 'Anda yakin ingin menghapus akun ini secara permanen?', [
      { text: 'Batal', style: 'cancel' },
      { 
        text: 'Hapus', style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`${BACKEND_URL}/api/admin/users/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            if (res.ok) {
              setSelectedUser(null);
              fetchUsers();
            }
          } catch (e) { console.error(e); }
        }
      }
    ]);
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !selectedUser) return;
    setSendingMsg(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ userId: selectedUser.id, message: messageText })
      });
      if (res.ok) {
        Alert.alert('Sukses', 'Pesan terkirim. Banner akan muncul di layar user selama 5 menit.');
        setMessageText('');
      }
    } catch (e) { console.error(e); }
    setSendingMsg(false);
  };

  // --- Transactions Actions ---
  const handleTransaction = async (id: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/transactions/${id}/${action}`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchTransactions();
    } catch (e) { console.error(e); }
  };

  // --- Alert Actions ---
  const deleteAlert = async (id: string) => {
    Alert.alert('Hapus Pesan', 'Hapus pesan ini?', [
      { text: 'Batal', style: 'cancel' },
      { 
        text: 'Hapus', style: 'destructive',
        onPress: async () => {
          const res = await fetch(`${BACKEND_URL}/api/admin/alerts/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
          if (res.ok) fetchAlerts();
        }
      }
    ]);
  };

  const saveEditedAlert = async () => {
    if (!editingAlert || !editAlertText.trim()) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/alerts/${editingAlert.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ message: editAlertText })
      });
      if (res.ok) {
        setEditingAlert(null);
        fetchAlerts();
        Alert.alert('Sukses', 'Pesan diubah dan durasi diperpanjang 5 menit lagi.');
      }
    } catch (e) {}
  };


  // --- Renderers ---
  const renderUser = ({ item }: { item: any }) => (
    <View style={[styles.card, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <Typography variant="h3" weight="bold">{item.name}</Typography>
          <Typography variant="body" color={COLORS.textSecondary}>{item.email}</Typography>
        </View>
        <Button size="sm" title="Kelola" onPress={() => setSelectedUser(item)} />
      </View>
    </View>
  );

  const renderTransaction = ({ item }: { item: any }) => (
    <View style={[styles.card, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]}>
      <View style={styles.userInfo}>
        <Typography variant="h3" weight="bold">{item.userName || item.userEmail}</Typography>
        <Typography variant="body" color={COLORS.textSecondary}>Upgrade: {item.tier?.toUpperCase()}</Typography>
        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: item.status === 'pending' ? COLORS.warning : (item.status === 'approved' ? COLORS.primary : COLORS.danger) }]}>
            <Typography variant="caption" color="#FFF" weight="bold">{item.status.toUpperCase()}</Typography>
          </View>
        </View>
      </View>
      
      {item.status === 'pending' && (
        <View style={styles.actions}>
          <Button title="Terima" size="sm" onPress={() => handleTransaction(item.id, 'approve')} style={[styles.actionBtn, { backgroundColor: COLORS.primary }]} />
          <Button size="sm" variant="outline" onPress={() => handleTransaction(item.id, 'reject')} style={[styles.actionBtn, { borderColor: COLORS.danger }]}>
            <Typography variant="body" weight="bold" color={COLORS.danger}>Tolak</Typography>
          </Button>
        </View>
      )}
    </View>
  );

  const renderAlertItem = ({ item }: { item: any }) => {
    const isExpired = new Date() > new Date(item.expiresAt);
    return (
      <View style={[styles.card, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, opacity: isExpired ? 0.6 : 1 }]}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Typography variant="caption" color={COLORS.textSecondary}>Untuk: {item.userEmail}</Typography>
            <Typography variant="body" weight="bold" style={{ marginVertical: 4 }}>"{item.message}"</Typography>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Clock size={12} color={COLORS.textSecondary} style={{ marginRight: 4 }}/>
              <Typography variant="caption" color={COLORS.textSecondary}>{new Date(item.expiresAt).toLocaleTimeString()} {isExpired ? '(Habis)' : '(Aktif)'}</Typography>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity onPress={() => { setEditingAlert(item); setEditAlertText(item.message); }}>
              <Edit3 size={20} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteAlert(item.id)}>
              <Trash2 size={20} color={COLORS.danger} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <Header title="Super Admin Panel" />
      
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, activeTab === 'users' && styles.activeTab]} onPress={() => setActiveTab('users')}>
          <Typography weight="bold" color={activeTab === 'users' ? COLORS.primary : COLORS.textSecondary}>User</Typography>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'alerts' && styles.activeTab]} onPress={() => setActiveTab('alerts')}>
          <Typography weight="bold" color={activeTab === 'alerts' ? COLORS.primary : COLORS.textSecondary}>Pesan</Typography>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'transactions' && styles.activeTab]} onPress={() => setActiveTab('transactions')}>
          <Typography weight="bold" color={activeTab === 'transactions' ? COLORS.primary : COLORS.textSecondary}>Transaksi</Typography>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.center}><Typography>Memuat data...</Typography></View>
      ) : (
        <FlatList
          data={activeTab === 'users' ? users : (activeTab === 'alerts' ? alerts : transactions)}
          keyExtractor={(item) => item.id}
          renderItem={activeTab === 'users' ? renderUser : (activeTab === 'alerts' ? renderAlertItem : renderTransaction)}
          contentContainerStyle={styles.list}
        />
      )}

      {/* MODAL USER DETAIL */}
      <Modal visible={!!selectedUser} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelectedUser(null)}>
        <View style={[styles.modalContainer, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
          <View style={styles.modalHeader}>
            <Typography variant="h2" weight="bold">Detail Pengguna</Typography>
            <TouchableOpacity onPress={() => setSelectedUser(null)}><X size={24} color={isDark ? '#FFF' : '#000'} /></TouchableOpacity>
          </View>
          
          <ScrollView contentContainerStyle={{ padding: SPACING.lg }}>
            <View style={[styles.detailBox, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]}>
              <Typography variant="caption" color={COLORS.textSecondary}>ID</Typography>
              <Typography variant="body" weight="bold">{selectedUser?.id}</Typography>
              <View style={{ height: 10 }} />
              <Typography variant="caption" color={COLORS.textSecondary}>Nama</Typography>
              <Typography variant="body" weight="bold">{selectedUser?.name}</Typography>
              <View style={{ height: 10 }} />
              <Typography variant="caption" color={COLORS.textSecondary}>Email</Typography>
              <Typography variant="body" weight="bold">{selectedUser?.email}</Typography>
              <View style={{ height: 10 }} />
              <Typography variant="caption" color={COLORS.textSecondary}>Pekerjaan & Institusi</Typography>
              <Typography variant="body">{selectedUser?.role || '-'} di {selectedUser?.institution || '-'}</Typography>
              <View style={{ height: 10 }} />
              <Typography variant="caption" color={COLORS.textSecondary}>Tier / Akses</Typography>
              <Typography variant="body" weight="bold" color={COLORS.primary}>{selectedUser?.subscriptionTier?.toUpperCase()} {selectedUser?.isAdmin ? '(SUPER ADMIN)' : ''}</Typography>
            </View>

            <Typography variant="h3" weight="bold" style={{ marginTop: SPACING.xl, marginBottom: SPACING.sm }}>Modifikasi Status</Typography>
            <View style={styles.actionsRow}>
              <Button 
                title={selectedUser?.subscriptionTier === 'pro' ? 'Jadikan Free' : 'Jadikan Pro'} 
                variant="outline" size="sm" style={{ flex: 1, marginRight: 8 }}
                onPress={() => updateUser(selectedUser.id, { subscriptionTier: selectedUser?.subscriptionTier === 'pro' ? 'free' : 'pro' })}
              />
              <Button 
                title={selectedUser?.isAdmin ? 'Hapus Admin' : 'Jadikan Admin'} 
                variant="outline" size="sm" style={{ flex: 1 }}
                onPress={() => updateUser(selectedUser.id, { isAdmin: !selectedUser?.isAdmin })}
              />
            </View>
            <Button 
              variant="outline" 
              style={{ marginTop: 8, borderColor: COLORS.danger }}
              onPress={() => deleteUser(selectedUser.id)}
            >
              <Typography variant="body" weight="bold" color={COLORS.danger}>Hapus Akun Permanen</Typography>
            </Button>

            <Typography variant="h3" weight="bold" style={{ marginTop: SPACING.xl, marginBottom: SPACING.sm }}>Kirim Pesan (Alert 5 Menit)</Typography>
            <View style={styles.messageBox}>
              <TextInput
                style={[styles.input, { color: isDark ? '#FFF' : '#000', borderColor: isDark ? COLORS.darkBorder : COLORS.border }]}
                placeholder="Tulis pesan darurat / informasi..."
                placeholderTextColor={COLORS.textSecondary}
                value={messageText}
                onChangeText={setMessageText}
                multiline
              />
              <Button title="Kirim Pesan" onPress={sendMessage} loading={sendingMsg} icon={<MessageSquare size={16} color="#FFF"/>} style={{ marginTop: 8 }} />
            </View>

          </ScrollView>
        </View>
      </Modal>

      {/* MODAL EDIT ALERT */}
      <Modal visible={!!editingAlert} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.editAlertBox, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]}>
            <Typography variant="h3" weight="bold" style={{ marginBottom: 16 }}>Edit Pesan</Typography>
            <TextInput
              style={[styles.input, { color: isDark ? '#FFF' : '#000', borderColor: isDark ? COLORS.darkBorder : COLORS.border, marginBottom: 16 }]}
              value={editAlertText}
              onChangeText={setEditAlertText}
              multiline
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
              <Button title="Batal" variant="ghost" size="sm" onPress={() => setEditingAlert(null)} />
              <Button title="Simpan" size="sm" onPress={saveEditedAlert} />
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: SPACING.md },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { padding: SPACING.md, borderRadius: 12, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userInfo: { marginBottom: SPACING.sm, flex: 1 },
  badges: { flexDirection: 'row', marginTop: SPACING.sm, gap: SPACING.sm },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flexWrap: 'wrap' },
  actionBtn: { marginRight: SPACING.sm, marginBottom: SPACING.sm },
  tabContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingHorizontal: SPACING.md },
  tab: { flex: 1, paddingVertical: SPACING.md, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
  
  modalContainer: { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  detailBox: { padding: SPACING.md, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  messageBox: { marginTop: 8 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, minHeight: 80, textAlignVertical: 'top' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  editAlertBox: { width: '100%', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border }
});
