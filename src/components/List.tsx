import { useState } from 'react'
import {
    Box,
    Button,
    HStack,
    Input,
    VStack,
    Text,
    Heading,
    useToast,
    List as ChakraList,
    ListItem as ChakraListItem,
    IconButton,
} from '@chakra-ui/react'
import { ListItem as ListItemType, ShoppingList } from '../types/index'
import { formatListDate } from '../services/analyticsService'
import ListItem from './ListItem'
import { AddIcon } from '@chakra-ui/icons'

interface ListProps {
    list: ShoppingList | null
    onAddItem: (title: string) => void
    onToggleItem: (itemId: string) => void
    onDeleteItem: (itemId: string) => void
    onCreateNewList: () => void
}

function List({
    list,
    onAddItem,
    onToggleItem,
    onDeleteItem,
    onCreateNewList,
}: ListProps) {
    const [inputValue, setInputValue] = useState('')
    const toast = useToast()

    const handleAddItem = () => {
        if (!inputValue.trim()) {
            toast({
                title: 'Erro',
                description: 'Por favor, insira um nome do produto',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return
        }

        if (inputValue.length > 200) {
            toast({
                title: 'Erro',
                description: 'Nome do produto muito longo (máximo 200 caracteres)',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return
        }

        // Check for duplicates
        if (list?.items.some(item => item.title.toLowerCase() === inputValue.trim().toLowerCase())) {
            toast({
                title: 'Erro',
                description: 'Este item já está em sua lista',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return
        }

        onAddItem(inputValue.trim())
        setInputValue('')
        toast({
            title: 'Sucesso',
            description: 'Item adicionado',
            status: 'success',
            duration: 2000,
            isClosable: true,
        })
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddItem()
        }
    }

    if (!list) {
        return (
            <Box as="main" p={4} maxW="600px" mx="auto">
                <VStack spacing={6} align="center" py={8}>
                    <Heading as="h1" size="lg">
                        Nenhuma lista encontrada
                    </Heading>
                    <Text color="gray.500">
                        Você pode criar uma nova lista quando estiver pronto
                    </Text>
                    <Button borderRadius={100} colorScheme="blue" onClick={onCreateNewList} size="lg">
                        Criar
                    </Button>
                </VStack>
            </Box>
        )
    }

    const completedCount = list.items.filter(item => item.completed).length

    return (
        <Box as="main" p={4} maxW="600px" mx="auto">
            <VStack spacing={4} align="stretch">
                {/* List Metadata */}
                <Box>
                    <Heading as="h1" size="lg" mb={2}>
                        Lista de compras
                    </Heading>
                    <Text fontSize="sm" color="gray.500">
                        Criada: {formatListDate(list.createdAt)}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                        {list.items.length} itens, {completedCount} concluídos
                    </Text>
                </Box>

                {/* Add Item Form */}
                <HStack as="form" spacing={2} onSubmit={e => { e.preventDefault(); handleAddItem() }}>
                    <Input
                        placeholder="Insira o nome do produto..."
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        size="md"
                        maxLength={200}
                    />
                    <IconButton
                        onClick={handleAddItem}
                        isRound={true}
                        variant='solid'
                        colorScheme='blue'
                        aria-label='Criar'
                        fontSize='20px'
                        type="button"
                        icon={<AddIcon />}
                    />
                </HStack>

                {/* Items List */}
                {list.items.length === 0 ? (
                    <Box py={8} textAlign="center">
                        <Text color="gray.500">Nenhum item ainda. Adicione seu primeiro item acima!</Text>
                    </Box>
                ) : (
                    <ChakraList spacing={0} border="1px" borderColor="gray.200" borderRadius="md" overflow="hidden">
                        {list.items.map((item: ListItemType, index: number) => (
                            <ChakraListItem
                                key={item.id}
                                p={3}
                                borderBottom={index < list.items.length - 1 ? '1px solid' : 'none'}
                                borderColor="gray.200"
                                bg={item.completed ? 'gray.50' : 'white'}
                            >
                                <ListItem
                                    item={item}
                                    onToggleItem={onToggleItem}
                                    onDeleteItem={onDeleteItem}
                                />
                            </ChakraListItem>
                        ))}
                    </ChakraList>
                )}
            </VStack>
        </Box>
    )
}

export default List
