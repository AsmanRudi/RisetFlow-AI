const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, search, replacement) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  content = content.replace(search, replacement);
  fs.writeFileSync(fullPath, content);
}

// 1. Fix ConfirmModal absoluteFillObject
replaceInFile('src/components/ui/ConfirmModal.tsx', '...StyleSheet.absoluteFillObject', '...StyleSheet.absoluteFill');

// 2. Fix Button Props (children and StyleProp)
const buttonPath = path.join(process.cwd(), 'src/components/ui/Button.tsx');
if (fs.existsSync(buttonPath)) {
  let btnContent = fs.readFileSync(buttonPath, 'utf8');
  if (!btnContent.includes('StyleProp<ViewStyle>')) {
    btnContent = btnContent.replace(
      "import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';",
      "import { TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';"
    );
    btnContent = btnContent.replace(
      'style?: ViewStyle;',
      'style?: StyleProp<ViewStyle>;\\n  children?: React.ReactNode;'
    );
    fs.writeFileSync(buttonPath, btnContent);
  }
}

// 3. Fix AppStore (lang, setLang, toggleTheme)
const storePath = path.join(process.cwd(), 'src/store/useAppStore.ts');
if (fs.existsSync(storePath)) {
  let storeContent = fs.readFileSync(storePath, 'utf8');
  if (!storeContent.includes('lang: string')) {
    storeContent = storeContent.replace(
      "interface AppState {\\n  theme: 'light' | 'dark';\\n  setTheme: (theme: 'light' | 'dark') => void;\\n}",
      "interface AppState {\\n  theme: 'light' | 'dark';\\n  setTheme: (theme: 'light' | 'dark') => void;\\n  toggleTheme: () => void;\\n  lang: string;\\n  setLang: (lang: string) => void;\\n}"
    );
    storeContent = storeContent.replace(
      "setTheme: (theme) => set({ theme }),",
      "setTheme: (theme) => set({ theme }),\\n      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),\\n      lang: 'id',\\n      setLang: (lang) => set({ lang }),"
    );
    fs.writeFileSync(storePath, storeContent);
  }
}

// 4. Fix index.tsx mockData import and usage
const indexPath = path.join(process.cwd(), 'src/app/(tabs)/index.tsx');
if (fs.existsSync(indexPath)) {
  let idxContent = fs.readFileSync(indexPath, 'utf8');
  idxContent = idxContent.replace(
    "import { mockData } from '@/data/mock';",
    "import { useWorkspaceStore } from '@/store/useWorkspaceStore';"
  );
  idxContent = idxContent.replace(
    "const role = useAuthStore(state => state.user?.role) || 'student';",
    "const role = useAuthStore(state => state.user?.role) || 'student';\\n  const notes = useWorkspaceStore(state => state.notes);\\n  const tasks = useWorkspaceStore(state => state.tasks);"
  );
  idxContent = idxContent.replace(
    'const roleData = mockData[role as keyof typeof mockData] || mockData.student;',
    '// Using workspace store'
  );
  idxContent = idxContent.replace(
    'const activities = roleData.notes.map((n: any, i: number) => ({',
    'const activities = notes.slice(0,3).map((n: any, i: number) => ({'
  );
  fs.writeFileSync(indexPath, idxContent);
}

console.log('Fixes applied successfully');
