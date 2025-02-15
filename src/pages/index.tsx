import React from 'react';
import { Card, Grid, Typography, Box, Chip, Avatar } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import TimelineIcon from '@mui/icons-material/Timeline';

export default function Dashboard() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Logistics Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocalShippingIcon sx={{ mr: 1 }} color="primary" />
              <Typography variant="h6">Active Trips</Typography>
            </Box>
            <Typography variant="h3">24</Typography>
            <Typography variant="body2" color="text.secondary">
              8 arriving today
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ mr: 1 }} color="primary" />
              <Typography variant="h6">Drivers on Duty</Typography>
            </Box>
            <Typography variant="h3">18</Typography>
            <Typography variant="body2" color="text.secondary">
              85% of fleet active
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TimelineIcon sx={{ mr: 1 }} color="primary" />
              <Typography variant="h6">Deliveries Today</Typography>
            </Box>
            <Typography variant="h3">42</Typography>
            <Typography variant="body2" color="text.secondary">
              93% on time
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Active Trips Section */}
      <Card sx={{ mb: 4, p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Active Trips
        </Typography>
        <Grid container spacing={2}>
          {[1, 2, 3].map((trip) => (
            <Grid item xs={12} key={trip}>
              <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
                <Avatar sx={{ mr: 2 }}>JD</Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1">
                    Chicago, IL → Detroit, MI
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    John Doe • Truck #1234
                  </Typography>
                </Box>
                <Box>
                  <Chip
                    label="On Schedule"
                    color="success"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    ETA: 2:30 PM
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* Recent Deliveries Section */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Recent Deliveries
        </Typography>
        <Grid container spacing={2}>
          {[1, 2, 3].map((delivery) => (
            <Grid item xs={12} key={delivery}>
              <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
                <Avatar sx={{ mr: 2 }}>MS</Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1">
                    New York, NY → Boston, MA
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mike Smith • Completed at 10:45 AM
                  </Typography>
                </Box>
                <Chip label="Delivered" color="info" size="small" />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Card>
    </Box>
  );
} 