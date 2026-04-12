import { useState } from 'react'
import { VStack, Button, Input, Text, useToast, Card, CardBody, CardHeader, Heading, Divider } from '@chakra-ui/react'
import * as backupService from '../services/backupService'

interface BackupRestoreProps {
  onRestoreComplete: () => void
}

function BackupRestore({ onRestoreComplete }: BackupRestoreProps) {
  const [isRestoring, setIsRestoring] = useState(false)
  const toast = useToast()

  const handleExportBackup = () => {
    try {
      const data = backupService.exportBackup()
      backupService.downloadBackupFile(data)
      toast({
        title: 'Success',
        description: 'Backup downloaded',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export backup',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsRestoring(true)

    try {
      const data = await backupService.parseBackupFile(file)
      const confirm = window.confirm('This will replace your current data. Continue?')
      
      if (confirm) {
        backupService.restoreBackup(data)
        onRestoreComplete()
        toast({
          title: 'Success',
          description: 'Data restored',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to restore backup',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsRestoring(false)
      // Reset input
      if (e.target) {
        e.target.value = ''
      }
    }
  }

  return (
    <VStack spacing={8} maxW="500px" mx="auto">
      {/* Backup Section */}
      <Card w="100%">
        <CardHeader>
          <Heading size="md">Backup Data</Heading>
        </CardHeader>
        <Divider />
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Text fontSize="sm" color="gray.600">
              Download a backup of all your shopping lists and history
            </Text>
            <Button colorScheme="blue" onClick={handleExportBackup} w="100%">
              Download Backup
            </Button>
          </VStack>
        </CardBody>
      </Card>

      {/* Restore Section */}
      <Card w="100%">
        <CardHeader>
          <Heading size="md">Restore Data</Heading>
        </CardHeader>
        <Divider />
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Text fontSize="sm" color="gray.600">
              Restore your shopping lists from a backup file
            </Text>
            <Input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              disabled={isRestoring}
              p={1}
            />
          </VStack>
        </CardBody>
      </Card>

      {/* Clear All */}
      <Card w="100%" borderColor="red.200" borderWidth="1px">
        <CardHeader>
          <Heading size="md" color="red.600">
            Danger Zone
          </Heading>
        </CardHeader>
        <Divider />
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Text fontSize="sm" color="gray.600">
              Clear all data permanently (cannot be undone)
            </Text>
            <Button
              colorScheme="red"
              variant="outline"
              w="100%"
              onClick={() => {
                const confirm = window.confirm(
                  'This will permanently delete all your shopping lists. This cannot be undone. Continue?'
                )
                if (confirm) {
                  const confirm2 = window.confirm(
                    'Are you absolutely sure? This action cannot be reversed.'
                  )
                  if (confirm2) {
                    import('../services/storageService').then(m => m.clearAllData())
                    window.location.reload()
                  }
                }
              }}
            >
              Clear All Data
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  )
}

export default BackupRestore
