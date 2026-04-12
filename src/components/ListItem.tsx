import { HStack, Text, Checkbox, IconButton, useToast } from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import { ListItem as ListItemType } from '../types/index'
import { formatTime } from '../services/analyticsService'

interface ListItemProps {
  item: ListItemType
  onToggleItem: (itemId: string) => void
  onDeleteItem: (itemId: string) => void
}

function ListItem({ item, onToggleItem, onDeleteItem }: ListItemProps) {
  const toast = useToast()

  const handleDelete = () => {
    const confirmDelete = window.confirm('Remove this item?')
    if (confirmDelete) {
      onDeleteItem(item.id)
      toast({
        title: 'Item removed',
        status: 'info',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  return (
    <HStack spacing={3} w="100%" justify="space-between">
      <HStack spacing={3} flex={1}>
        <Checkbox
          isChecked={item.completed}
          onChange={() => onToggleItem(item.id)}
          variant="circular"
        />
        <Text
          textDecoration={item.completed ? 'line-through' : 'none'}
          color={item.completed ? 'gray.500' : 'black'}
          flex={1}
        >
          {item.title}
        </Text>
      </HStack>

      {item.completedAt && (
        <Text fontSize="sm" color="green.600" fontWeight="500" minW="60px" textAlign="right">
          {formatTime(item.completedAt)}
        </Text>
      )}

      <IconButton
        aria-label="Delete item"
        icon={<DeleteIcon />}
        size="sm"
        variant="ghost"
        colorScheme="red"
        onClick={handleDelete}
        _hover={{ bg: 'red.50' }}
      />
    </HStack>
  )
}

export default ListItem
