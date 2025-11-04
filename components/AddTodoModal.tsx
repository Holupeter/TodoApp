// components/AddTodoModal.tsx

import { useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  Text,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../hooks/useTheme';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import Modal from 'react-native-modal';

type AddTodoModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export const AddTodoModal = ({ isVisible, onClose }: AddTodoModalProps) => {
  const { currentTheme } = useTheme();
  const createTodo = useMutation(api.todos.createTodo);

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDesc, setNewTodoDesc] = useState('');
  const [newTodoDueDate, setNewTodoDueDate] = useState('');

  const handleCreateTodo = () => {
    if (newTodoTitle.trim() === '') return;

    createTodo({
      title: newTodoTitle,
      description: newTodoDesc,
      dueDate: newTodoDueDate,
    });

    setNewTodoTitle('');
    setNewTodoDesc('');
    setNewTodoDueDate('');
    onClose(); 
  };

  return (
    <StyledModal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={['down']} // Enable swipe down on mobile
      style={styles.modal}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ModalContent>
          <ModalTitle>Create New Task</ModalTitle>
          <StyledInput
            placeholder="Task Title"
            placeholderTextColor={currentTheme.textSecondary}
            value={newTodoTitle}
            onChangeText={setNewTodoTitle}
            autoFocus={true}
          />
          <StyledInput
            placeholder="Description (optional)"
            placeholderTextColor={currentTheme.textSecondary}
            value={newTodoDesc}
            onChangeText={setNewTodoDesc}
          />
          <StyledInput
            placeholder="Due Date (optional)"
            placeholderTextColor={currentTheme.textSecondary}
            value={newTodoDueDate}
            onChangeText={setNewTodoDueDate}
          />
          <SubmitButton onPress={handleCreateTodo}>
            <ButtonText>CREATE</ButtonText>
          </SubmitButton>
        </ModalContent>
      </KeyboardAvoidingView>
    </StyledModal>
  );
};

// --- Styles for this component ---

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
});

const StyledModal = styled(Modal)``;

const ModalContent = styled(View)`
  background-color: ${(props) => props.theme.surface};
  padding: 22px;
  padding-bottom: ${Platform.OS === 'ios' ? '34px' : '22px'}; /* Safe area for iOS */
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
`;

const ModalTitle = styled(Text)`
  font-size: 24px;
  font-family: ${(props) => props.theme.fontSemiBold};
  color: ${(props) => props.theme.text};
  margin-bottom: 24px;
  text-align: center;
`;

const StyledInput = styled(TextInput)`
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  padding: 14px 16px; 
  border-radius: 8px;
  font-size: 16px;
  font-family: ${(props) => props.theme.fontRegular}; 
  margin-bottom: 12px;
`;

const SubmitButton = styled(Pressable)`
  background-color: ${(props) => props.theme.primary};
  padding: 14px; 
  border-radius: 8px;
  align-items: center;
  margin-top: 10px;
`;

const ButtonText = styled(Text)`
  color: ${(props) => props.theme.buttonText};
  font-family: ${(props) => props.theme.fontSemiBold};
  font-size: 16px;
`;