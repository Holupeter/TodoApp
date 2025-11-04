// components/AddTodoForm.tsx (FIXED for Text String Error)

import { View, TextInput, Pressable, Platform, Text } from 'react-native'; 
import styled from 'styled-components/native';
import { useTheme } from '../hooks/useTheme';

type AddTodoFormProps = {
  onPress: () => void;
}

export const AddTodoForm = ({ onPress }: AddTodoFormProps) => {
  const { currentTheme } = useTheme();

  return (
    <InputContainer onPress={onPress}>
      <RoundCheckboxButton />
      {/* FIX: Ensure Text component is directly used for string rendering */}
      <StyledInputText>Create a new todo...</StyledInputText> 
    </InputContainer>
  );
};

// --- Styles ---

const InputContainer = styled(Pressable)`
  background-color: ${(props) => props.theme.surface};
  border-radius: 6px;
  flex-direction: row;
  align-items: center;
  padding: 18px;
  margin-top: 24px; /* Adjust margin-top to separate from header */
  margin-bottom: 24px;
  z-index: 10; 
`;

const RoundCheckboxButton = styled(View)`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.textSecondary};
  margin-right: 18px;
`;

const StyledInputText = styled(Text)` /* Based on Text for string content */
  color: ${(props) => props.theme.textSecondary};
  font-size: 16px;
  font-family: ${(props) => props.theme.fontRegular};
`;