import { useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { ShoppingList, CompletedList } from '../types/index'
import { calculateCompletionPercent, getRecentTrips, getDashboardStats, formatListDate, formatDuration } from '../services/analyticsService'
import TripDetailDialog from './TripDetailDialog'

interface DashboardProps {
    activeList: ShoppingList | null
    completedLists: CompletedList[]
}

function StatCard({ label, value }: { label: string; value: string | number }) {
    return (
        <Card variant="outlined">
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="caption" color="text.secondary" component="div">
                    {label}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {value}
                </Typography>
            </CardContent>
        </Card>
    )
}

function Dashboard({ activeList, completedLists }: DashboardProps) {
    const [selectedTrip, setSelectedTrip] = useState<CompletedList | null>(null)
    const stats = getDashboardStats(completedLists)
    const recentTrips = getRecentTrips(completedLists, 5)

    return (
        <>
        <Container maxWidth="sm" sx={{ pt: 2, pb: 2 }}>
            <Stack spacing={4}>
                {/* Current Trip */}
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                        Viagem atual
                    </Typography>
                    {activeList ? (
                        <Card variant="outlined">
                            <CardContent>
                                <Stack spacing={0.5}>
                                    <Typography variant="body2">
                                        <strong>Início:</strong> {formatListDate(activeList.createdAt)}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Itens:</strong> {activeList.items.length}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Concluídos:</strong> {calculateCompletionPercent(activeList.items)}%
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    ) : (
                        <Typography color="text.secondary" variant="body2">Nenhuma viagem ativa</Typography>
                    )}
                </Box>

                {/* Statistics */}
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                        Estatísticas
                    </Typography>
                    <Grid container spacing={1.5}>
                        <Grid size={6}>
                            <StatCard label="Total de viagens" value={stats.totalTrips} />
                        </Grid>
                        <Grid size={6}>
                            <StatCard label="Duração média" value={stats.averageDurationFormatted} />
                        </Grid>
                        <Grid size={6}>
                            <StatCard label="Total de itens" value={stats.totalItemsShipped} />
                        </Grid>
                        <Grid size={6}>
                            <StatCard
                                label="Média itens/viagem"
                                value={stats.totalTrips > 0 ? Math.round(stats.totalItemsShipped / stats.totalTrips) : 0}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Recent Trips */}
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                        Viagens recentes
                    </Typography>
                    {recentTrips.length === 0 ? (
                        <Typography color="text.secondary" variant="body2">Nenhuma viagem concluída ainda</Typography>
                    ) : (
                        <Stack spacing={1}>
                            {recentTrips.map(trip => (
                                <Card
                                    key={trip.id}
                                    variant="outlined"
                                    onClick={() => setSelectedTrip(trip)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {formatListDate(trip.createdAt)}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Duração: {formatDuration(trip.durationMs)} · {trip.itemCount} itens
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Stack>
                    )}
                </Box>
            </Stack>
        </Container>

        <TripDetailDialog trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
        </>
    )
}

export default Dashboard
