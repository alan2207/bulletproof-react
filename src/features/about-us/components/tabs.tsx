import { Hidden } from '@material-ui/core';
import { RadioButtonCheckedOutlined, RadioButtonUncheckedOutlined } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import * as React from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const VerticalTabs = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'row-reverse',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          position: { xs: 'absolute', md: 'initial' },
          marginTop: { xs: '10%' },
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          orientation="vertical"
          TabIndicatorProps={{
            style: { backgroundColor: 'transparent' },
          }}
          sx={{
            backgroundColor: { xs: 'transparent', md: '#F7F3F0' },
          }}
        >
          <Tab
            icon={value === 0 ? <RadioButtonCheckedOutlined /> : <RadioButtonUncheckedOutlined />}
            iconPosition="end"
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              '&.Mui-selected': {
                color: '#EE3126',
              },
            }}
            label={
              <Hidden mdDown>
                <Typography
                  variant="h6"
                  fontFamily={`${value === 0 ? 'Poppins-Bold' : 'Poppins-Regular'}`}
                  color={value === 0 ? '#EE3126' : '#3F3F3F'}
                >
                  Visualise
                </Typography>
              </Hidden>
            }
            {...a11yProps(0)}
          />
          <Tab
            icon={value === 1 ? <RadioButtonCheckedOutlined /> : <RadioButtonUncheckedOutlined />}
            iconPosition="end"
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              '&.Mui-selected': {
                color: '#EE3126',
              },
            }}
            label={
              <Hidden mdDown>
                <Typography
                  variant="h6"
                  fontFamily={`${value === 1 ? 'Poppins-Bold' : 'Poppins-Regular'}`}
                  color={value === 1 ? '#EE3126' : '#3F3F3F'}
                >
                  DIY or Guided
                </Typography>
              </Hidden>
            }
            {...a11yProps(1)}
          />
          <Tab
            icon={value === 2 ? <RadioButtonCheckedOutlined /> : <RadioButtonUncheckedOutlined />}
            iconPosition="end"
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              '&.Mui-selected': {
                color: '#EE3126',
              },
            }}
            label={
              <Hidden mdDown>
                <Typography
                  variant="h6"
                  fontFamily={`${value === 2 ? 'Poppins-Bold' : 'Poppins-Regular'}`}
                  color={value === 2 ? '#EE3126' : '#3F3F3F'}
                >
                  Connect
                </Typography>
              </Hidden>
            }
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <img alt="alt" src="/images/with-2.png" />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <img alt="alt" src="/images/with-2.png" />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <img alt="alt" src="/images/with-2.png" />
      </TabPanel>
    </Box>
  );
};
