const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, search, replacement) {
  const fullPath = path.join(process.cwd(), filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  content = content.replace(search, replacement);
  fs.writeFileSync(fullPath, content);
}

// Fix absoluteFillObject
replaceInFile('src/components/ui/BottomSheet.tsx', '...StyleSheet.absoluteFillObject', '...StyleSheet.absoluteFill');
replaceInFile('src/components/ui/FAB.tsx', '...StyleSheet.absoluteFillObject', '...StyleSheet.absoluteFill');

// Fix Input style typing
replaceInFile('src/components/ui/Input.tsx',
  'interface InputProps extends TextInputProps {',
  "import { ViewStyle } from 'react-native';\\ninterface InputProps extends TextInputProps {\\n  containerStyle?: ViewStyle;"
);
replaceInFile('src/components/ui/Input.tsx',
  'export const Input: React.FC<InputProps> = ({ icon, style, ...props }) => {',
  'export const Input: React.FC<InputProps> = ({ icon, style, containerStyle, ...props }) => {'
);
replaceInFile('src/components/ui/Input.tsx',
  'style\\n      ]}',
  'containerStyle\\n      ]}'
);

// Fix Skeleton DimensionValue
replaceInFile('src/components/ui/Skeleton.tsx',
  "import { View, StyleSheet, ViewStyle } from 'react-native';",
  "import { View, StyleSheet, ViewStyle, DimensionValue } from 'react-native';"
);
replaceInFile('src/components/ui/Skeleton.tsx',
  'width?: number | string;',
  'width?: DimensionValue;'
);
replaceInFile('src/components/ui/Skeleton.tsx',
  'height?: number | string;',
  'height?: DimensionValue;'
);

console.log('TS Fixes applied');
