// app/index.tsx (FINAL VERSION - Search Icon Added)

import {
  Text,
  View,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../hooks/useTheme';
import { useState, useEffect, useMemo } from 'react';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image'; 

import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';

// Import our components
import { AddTodoForm } from '../components/AddTodoForm';
import { AddTodoModal } from '../components/AddTodoModal'; 
import { TodoItem } from '../components/TodoItem';

type FilterType = 'all' | 'active' | 'completed';
type Todo = NonNullable<ReturnType<typeof useQuery<typeof api.todos.getTodos>>>[number];

export default function HomeScreen() {
  const { theme, toggleTheme, currentTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [isModalVisible, setIsModalVisible] = useState(false); 
  // NEW STATE: Controls whether the search input field is visible
  const [isSearchActive, setIsSearchActive] = useState(false); 

  const todosFromConvex = useQuery(api.todos.getTodos, { filter: filter });

  const [displayedTodos, setDisplayedTodos] = useState<Todo[] | undefined>(
    undefined
  );

  useEffect(() => {
    setDisplayedTodos(todosFromConvex);
  }, [todosFromConvex]); 

  const finalFilteredList = useMemo(() => {
    if (displayedTodos === undefined) return undefined;
    
    if (!searchQuery) {
      return displayedTodos; 
    }

    return displayedTodos.filter((todo) =>
      todo.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [displayedTodos, searchQuery]);
  
  const renderDraggableItem = ({ item, drag, isActive }: RenderItemParams<Todo>) => {
    return <TodoItem item={item} drag={drag} isActive={isActive} />;
  };
  
  const totalItems = todosFromConvex ? todosFromConvex.length : 0;
  
  const clearCompleted = useMutation(api.todos.clearCompletedTodos); 

  const isMobile = Platform.OS !== 'web';

  return (
    <Container>
      <StatusBar barStyle="light-content" />

      {/* --- The Header Image/Gradient Block (FULL WIDTH) --- */}
      <ImageHeaderContainer $isMobile={isMobile}>
        {/* 1. Background Image */}
        <BackgroundImage 
            source={'https://images.unsplash.com/photo-1549497042-3e289e6e4265?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
            contentFit="cover"
            contentPosition="top"
        />

        {/* 2. Gradient Overlay */}
        <GradientOverlay
            colors={['#574EACBB', '#9C62CCBB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
        />

        {/* 3. Header Content */}
        <HeaderContent $isMobile={isMobile}>
          <HeaderTitle $isMobile={isMobile}>T O D O</HeaderTitle>
          <ThemeButton onPress={toggleTheme}>
            <Ionicons 
              name={theme === 'light' ? 'moon-outline' : 'sunny-outline'} 
              size={24} 
              color={currentTheme.buttonText} 
            />
          </ThemeButton>
        </HeaderContent>

        {/* Form Trigger sits right under the title */}
        <AddTodoFormContainer $isMobile={isMobile}> 
          <AddTodoForm onPress={() => setIsModalVisible(true)} /> 
        </AddTodoFormContainer>
        
      </ImageHeaderContainer>

      {/* --- The Main List Area --- */}
      <ListArea $isMobile={isMobile}>
        
        {/* NEW: Conditional Search Input Field */}
        {isSearchActive && (
            <SearchBarContainer>
                <SearchBar
                    placeholder="Search by title..."
                    placeholderTextColor={currentTheme.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoFocus={true}
                />
            </SearchBarContainer>
        )}

        {finalFilteredList === undefined ? (
          <LoadingContainer>
            <ActivityIndicator size="large" color={currentTheme.primary} />
            <Subtitle>Loading todos...</Subtitle>
          </LoadingContainer>
        ) : (
          <>
            {/* The List Block (seamless) */}
            <ListBlockContainer>
              <DraggableFlatList
                data={finalFilteredList}
                onDragEnd={({ data }) => setDisplayedTodos(data)} 
                keyExtractor={(item) => item._id}
                renderItem={renderDraggableItem}
                ListEmptyComponent={() => (
                  <EmptyContainer>
                    <Subtitle>
                      No todos yet.
                    </Subtitle>
                  </EmptyContainer>
                )}
                contentContainerStyle={{paddingBottom: 0}}
              />
            </ListBlockContainer>
            
            {/* --- CORRECTED FOOTER/FILTER BAR (Visible on both) --- */}
            <FooterContainer>
                
                {/* 1. Item Count (Desktop Only) */}
                {Platform.OS === 'web' && (
                    <FooterText>{finalFilteredList.length} items left</FooterText>
                )}
                
                {/* 2. Filter Buttons (Hidden on mobile footer) */}
                <FilterButtons $isMobile={isMobile}>
                  <FilterButton $isActive={filter === 'all'} onPress={() => setFilter('all')}>
                    <FilterText $isActive={filter === 'all'}>All</FilterText>
                  </FilterButton>
                  <FilterButton $isActive={filter === 'active'} onPress={() => setFilter('active')}>
                    <FilterText $isActive={filter === 'active'}>Active</FilterText>
                  </FilterButton>
                  <FilterButton $isActive={filter === 'completed'} onPress={() => setFilter('completed')}>
                    <FilterText $isActive={filter === 'completed'}>Completed</FilterText>
                  </FilterButton>
                </FilterButtons>

                {/* 3. Search Button (Added) */}
                <SearchButton onPress={() => setIsSearchActive(!isSearchActive)}>
                    <Ionicons 
                        name={isSearchActive ? "close-circle-outline" : "search"} 
                        size={isMobile ? 24 : 20} 
                        color={currentTheme.textSecondary} 
                    />
                </SearchButton>

                {/* 4. Clear Completed Button (Hidden on Mobile) */}
                {Platform.OS === 'web' && (
                  <ClearCompletedButton onPress={() => clearCompleted({})}>
                    <ClearCompletedText>Clear Completed</ClearCompletedText>
                  </ClearCompletedButton>
                )}
            </FooterContainer>

            <DragText>Drag and drop to reorder list</DragText>

          </>
        )}

      </ListArea>
      
      {/* The Modal Component */}
      <AddTodoModal 
        isVisible={isModalVisible} 
        onClose={() => setIsModalVisible(false)} 
      />
    </Container>
  );
}

// --- STYLES ---

const Container = styled(View)`
  flex: 1;
  background-color: ${(props) => props.theme.background};
`;

/* FINAL HEADER STYLES */
const ImageHeaderContainer = styled(View)<{ $isMobile: boolean }>`
  height: ${(props) => (props.$isMobile ? '160px' : '220px')}; 
  justify-content: flex-start;
  width: 100%; 
`;

const BackgroundImage = styled(Image)`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const GradientOverlay = styled(LinearGradient)`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.8;
`;

const HeaderContent = styled(View)<{ $isMobile: boolean }>`
  padding: 0 16px; 
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${(props) => (props.$isMobile ? '40px' : '60px')}; 
  margin-bottom: ${(props) => (props.$isMobile ? '15px' : '30px')};
  z-index: 2; 
`;

const HeaderTitle = styled(Text)<{ $isMobile: boolean }>`
  font-size: ${(props) => (props.$isMobile ? '20px' : '32px')}; 
  font-family: ${(props) => props.theme.fontBold};
  color: ${(props) => props.theme.buttonText};
  letter-spacing: ${(props) => props.isMobile ? '8px' : '12px'}; 
  margin-left: 10px;
`;

const AddTodoFormContainer = styled(View)<{ $isMobile: boolean }>`
  padding: 0 16px;
  z-index: 2;
  margin-top: -30px; 
`;
/* END FINAL HEADER STYLES */

/* FINAL LIST STYLES */
const ListArea = styled(View)<{ $isMobile: boolean }>`
    flex: 1;
    background-color: ${(props) => props.theme.background};
    /* Margin logic for mobile is fixed, desktop is less aggressive */
    margin-top: ${(props) => (props.$isMobile ? '10px' : '-25px')}; 
    z-index: 1;
    padding: 0 16px; 
`;

const ListBlockContainer = styled(View)`
    background-color: ${(props) => props.theme.surface};
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    margin-bottom: 24px;
`;
/* END FINAL LIST STYLES */

// NEW SEARCH BAR STYLES
const SearchBarContainer = styled(View)`
  background-color: ${(props) => props.theme.surface};
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 12px;
`;

const SearchBar = styled(TextInput)`
  color: ${(props) => props.theme.text};
  font-size: 16px;
  font-family: ${(props) => props.theme.fontRegular};
  padding: 0;
  /* Reset background as it's set on SearchBarContainer */
  background-color: transparent; 
`;
// END NEW SEARCH BAR STYLES


const ThemeButton = styled(Pressable)`
  padding: 8px;
`;

const ButtonText = styled(Text)`
  color: ${(props) => props.theme.buttonText};
  font-family: ${(props) => props.theme.fontSemiBold};
`;

const Subtitle = styled(Text)`
  font-size: 16px;
  font-family: ${(props) => props.theme.fontRegular};
  color: ${(props) => props.theme.textSecondary};
  text-align: center;
  margin-top: 16px;
`;

const LoadingContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const EmptyContainer = styled(View)`
  padding: 40px;
  align-items: center;
`;

const FooterContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.surface};
  padding: 16px 18px;
  border-top-width: 1px;
  border-top-color: ${(props) => props.theme.background};
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  margin-bottom: 24px; 
`;

const FooterText = styled(Text)`
  font-size: 12px;
  font-family: ${(props) => props.theme.fontRegular};
  color: ${(props) => props.theme.textSecondary};
  flex: 1;
`;

const ClearCompletedButton = styled(Pressable)`
  padding: 4px;
`;

const ClearCompletedText = styled(Text)`
  font-size: 12px;
  font-family: ${(props) => props.theme.fontRegular};
  color: ${(props) => props.theme.textSecondary};
`;

const FilterButtons = styled(View)<{ $isMobile: boolean }>`
  flex-direction: row;
  /* Mobile: Justified center, taking up space | Desktop: Margin to align between elements */
  ${(props) => props.$isMobile ? 'justify-content: center; flex: 1;' : 'margin: 0 16px;'}
`;

const FilterButton = styled(Pressable)<{ $isActive: boolean }>`
  padding: 4px 8px;
  border-radius: 4px;
`;

const FilterText = styled(Text)<{ $isActive: boolean }>`
  font-size: 12px;
  font-family: ${(props) => props.theme.fontSemiBold};
  color: ${(props) =>
    props.$isActive ? props.theme.primary : props.theme.textSecondary};
`;

const DragText = styled(Text)`
    font-size: 12px;
    font-family: ${(props) => props.theme.fontRegular};
    color: ${(props) => props.theme.textSecondary};
    text-align: center;
    margin-top: 24px;
`;

// NEW SEARCH BUTTON STYLE
const SearchButton = styled(Pressable)`
    padding: 4px;
    margin-right: ${ (props) => Platform.OS === 'web' ? '16px' : '0' }; 
`;