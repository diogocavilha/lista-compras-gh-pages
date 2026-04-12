import { Box, Heading, VStack, Text, Card, CardBody, SimpleGrid, Stat, StatLabel, StatNumber } from '@chakra-ui/react'
import { ShoppingList, CompletedList } from '../types/index'
import { calculateCompletionPercent, getRecentTrips, getDashboardStats, formatListDate, formatDuration } from '../services/analyticsService'

interface DashboardProps {
    activeList: ShoppingList | null
    completedLists: CompletedList[]
}

function Dashboard({ activeList, completedLists }: DashboardProps) {
    const stats = getDashboardStats(completedLists)
    const recentTrips = getRecentTrips(completedLists, 5)

    return (
        <Box maxW="1000px" mx="auto">
            <VStack spacing={8} align="stretch">
                {/* Current Trip */}
                <Box>
                    <Heading as="h2" size="md" mb={4}>
                        Current Trip
                    </Heading>
                    {activeList ? (
                        <Card>
                            <CardBody>
                                <VStack align="start" spacing={2}>
                                    <Text>
                                        <strong>Started:</strong> {formatListDate(activeList.createdAt)}
                                    </Text>
                                    <Text>
                                        <strong>Items:</strong> {activeList.items.length}
                                    </Text>
                                    <Text>
                                        <strong>Completed:</strong> {calculateCompletionPercent(activeList.items)}%
                                    </Text>
                                </VStack>
                            </CardBody>
                        </Card>
                    ) : (
                        <Text color="gray.500">No active trip</Text>
                    )}
                </Box>

                {/* Statistics */}
                <Box>
                    <Heading as="h2" size="md" mb={4}>
                        Statistics
                    </Heading>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Stat>
                            <StatLabel>Total Trips</StatLabel>
                            <StatNumber>{stats.totalTrips}</StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel>Average Duration</StatLabel>
                            <StatNumber>{stats.averageDurationFormatted}</StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel>Total Items</StatLabel>
                            <StatNumber>{stats.totalItemsShipped}</StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel>Avg Items/Trip</StatLabel>
                            <StatNumber>{stats.totalTrips > 0 ? Math.round(stats.totalItemsShipped / stats.totalTrips) : 0}</StatNumber>
                        </Stat>
                    </SimpleGrid>
                </Box>

                {/* Recent Trips */}
                <Box>
                    <Heading as="h2" size="md" mb={4}>
                        Recent Trips
                    </Heading>
                    {recentTrips.length === 0 ? (
                        <Text color="gray.500">No completed trips yet</Text>
                    ) : (
                        <VStack spacing={2} align="stretch">
                            {recentTrips.map(trip => (
                                <Card key={trip.id}>
                                    <CardBody py={2}>
                                        <VStack align="start" spacing={1}>
                                            <Text fontSize="sm">
                                                <strong>{formatListDate(trip.createdAt)}</strong>
                                            </Text>
                                            <Text fontSize="sm" color="gray.600">
                                                Duration: {formatDuration(trip.durationMs)} • {trip.itemCount} items
                                            </Text>
                                        </VStack>
                                    </CardBody>
                                </Card>
                            ))}
                        </VStack>
                    )}
                </Box>
            </VStack>
        </Box>
    )
}

export default Dashboard
