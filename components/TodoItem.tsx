// components/TodoItem.tsx (Simplified for the Figma design)

import { View, Text, Pressable, Platform } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../hooks/useTheme';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Id } from '../convex/_generated/dataModel';
import { ScaleDecorator } from 'react-native-draggable-flatlist';

type Todo = {
  _id: Id<'todos'>;
  title: string;
  isCompleted: boolean;
  description?: string;
  dueDate?: string;
};

type TodoItemProps = {
  item: Todo;
  drag: () => void;
  isActive: boolean;
};

export const TodoItem = ({ item, drag, isActive }: TodoItemProps) => {
  const { currentTheme, theme } = useTheme();
  const updateTodo = useMutation(api.todos.updateTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);

  const handleToggleComplete = () => {
    updateTodo({ id: item._id, isCompleted: !item.isCompleted });
  };

  const handleDelete = () => {
    deleteTodo({ id: item._id });
  };

  const checkboxColor = item.isCompleted ? currentTheme.textSecondary : currentTheme.text;

  return (
    <ScaleDecorator>
      {/* Item container is now the list background */}
      <TodoItemContainer
        onLongPress={drag}
        disabled={isActive}
        $isActive={isActive}
        style={{ backgroundColor: currentTheme.surface }}
      >
        <CheckboxButton onPress={handleToggleComplete}>
          {item.isCompleted ? (
            <CompletedCheckmark>
              <Ionicons name="checkmark" size={16} color={currentTheme.buttonText} />
            </CompletedCheckmark>
          ) : (
            <RoundCheckboxBorder />
          )}
        </CheckboxButton>

        <TodoTitle $isCompleted={item.isCompleted}>{item.title}</TodoTitle>

        <DeleteButton onPress={handleDelete}>
          <Ionicons
            name="close" // Changed to 'close' for the 'X' look in the Figma
            size={22}
            color={currentTheme.textSecondary}
          />
        </DeleteButton>
      </TodoItemContainer>
    </ScaleDecorator>
  );
};

// --- Styles for this component ---

const TodoItemContainer = styled(Pressable)<{ $isActive: boolean }>`
  /* REMOVED SHADOW/ELEVATION */
  padding: 16px 18px; /* Tighter vertical padding, generous horizontal */
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.background}; /* Uses background color as a separator */
  flex-direction: row;
  align-items: center;
  opacity: ${(props) => (props.$isActive ? 0.8 : 1)};
`;

const CheckboxButton = styled(Pressable)`
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
  margin-right: 18px;
`;

const RoundCheckboxBorder = styled(View)`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.textSecondary};
`;

const CompletedCheckmark = styled(View)`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  /* Using a custom gradient color found in the Figma for completed state */
  background-color: #57D3BB; 
`;

const TodoTitle = styled(Text)<{ $isCompleted: boolean }>`
  flex: 1;
  font-size: 16px; 
  font-family: ${(props) => props.theme.fontRegular}; /* Regular weight for todo text */
  color: ${(props) =>
    props.$isCompleted ? props.theme.textSecondary : props.theme.text};
  text-decoration: ${(props) =>
    props.$isCompleted ? 'line-through' : 'none'};
  text-decoration-color: ${(props) => props.theme.textSecondary};
  line-height: 22px;
`;

const DeleteButton = styled(Pressable)`
  margin-left: auto; /* Pushes the button to the far right */
  padding: 4px;
`;