import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  Slider, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Divider,
  Box,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Home, 
  AttachMoney, 
  CreditScore, 
  Assignment, 
  CheckCircle,
  Calculate
} from '@mui/icons-material';

const DRAHFinanceCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(150000);
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [ficoScore, setFicoScore] = useState(600);
  const [annualIncome, setAnnualIncome] = useState(60000);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [isEligible, setIsEligible] = useState(null);
  const [eligibilityMessage, setEligibilityMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Calculate payment when inputs change
  useEffect(() => {
    calculatePayment();
  }, [loanAmount, interestRate, loanTerm]);

  const calculatePayment = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    // Monthly payment formula: P * (r * (1 + r)^n) / ((1 + r)^n - 1)
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    setMonthlyPayment(payment.toFixed(2));
    setTotalPayment((payment * numberOfPayments).toFixed(2));
    setTotalInterest(((payment * numberOfPayments) - principal).toFixed(2));
  };

  const checkEligibility = () => {
    setLoading(true);
    
    // This would be an API call in a real application
    setTimeout(() => {
      if (ficoScore < 500) {
        setIsEligible(false);
        setEligibilityMessage('FICO score below minimum requirement of 500');
      } else {
        // Simple debt-to-income ratio check
        const monthlyIncome = annualIncome / 12;
        const dti = (monthlyPayment / monthlyIncome) * 100;
        
        if (dti > 43) {
          setIsEligible(false);
          setEligibilityMessage('Debt-to-income ratio too high');
        } else {
          setIsEligible(true);
          setEligibilityMessage('Congratulations! You meet the basic eligibility requirements for DRAH Finance.');
        }
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Calculate sx={{ mr: 1 }} /> DRAH Finance Calculator
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Calculate your monthly payment and check eligibility for DRAH Finance with no PMI and no down payment required.
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Loan Details</Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>Loan Amount: ${loanAmount.toLocaleString()}</Typography>
              <Slider
                value={loanAmount}
                onChange={(e, newValue) => setLoanAmount(newValue)}
                min={50000}
                max={500000}
                step={5000}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `$${value.toLocaleString()}`}
              />
              <TextField
                label="Loan Amount"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                fullWidth
                variant="outlined"
                size="small"
                InputProps={{ startAdornment: '$' }}
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>Interest Rate: {interestRate}%</Typography>
              <Slider
                value={interestRate}
                onChange={(e, newValue) => setInterestRate(newValue)}
                min={2.5}
                max={7.5}
                step={0.1}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
              />
              <TextField
                label="Interest Rate"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                fullWidth
                variant="outlined"
                size="small"
                InputProps={{ endAdornment: '%' }}
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>Loan Term</InputLabel>
                <Select
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  label="Loan Term"
                >
                  <MenuItem value={15}>15 Years</MenuItem>
                  <MenuItem value={20}>20 Years</MenuItem>
                  <MenuItem value={30}>30 Years</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Payment Summary</Typography>
            
            <Card variant="outlined" sx={{ mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  ${Number(monthlyPayment).toLocaleString()}
                </Typography>
                <Typography variant="subtitle2">
                  Estimated Monthly Payment
                </Typography>
              </CardContent>
            </Card>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Loan Amount:</Typography>
                <Typography variant="body1">${Number(loanAmount).toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Loan Term:</Typography>
                <Typography variant="body1">{loanTerm} years</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Interest Rate:</Typography>
                <Typography variant="body1">{interestRate}%</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Total Interest:</Typography>
                <Typography variant="body1">${Number(totalInterest).toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Total Payment:</Typography>
                <Typography variant="body1">${Number(totalPayment).toLocaleString()}</Typography>
              </Grid>
            </Grid>
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>Check Eligibility</Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="FICO Score"
                  type="number"
                  value={ficoScore}
                  onChange={(e) => setFicoScore(Number(e.target.value))}
                  fullWidth
                  variant="outlined"
                  size="small"
                  helperText="Minimum score: 500"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Annual Income"
                  type="number"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(Number(e.target.value))}
                  fullWidth
                  variant="outlined"
                  size="small"
                  InputProps={{ startAdornment: '$' }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={checkEligibility}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <CreditScore />}
                >
                  Check Eligibility
                </Button>
              </Grid>
              
              {isEligible !== null && (
                <Grid item xs={12}>
                  <Alert severity={isEligible ? "success" : "error"}>
                    {eligibilityMessage}
                  </Alert>
                  
                  {isEligible && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" paragraph>
                        With DRAH Finance, you can qualify for this loan with:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <Chip icon={<CheckCircle />} label="No PMI Required" color="success" />
                        <Chip icon={<CheckCircle />} label="No Down Payment" color="success" />
                        <Chip icon={<CheckCircle />} label="Fixed Interest Rate" color="success" />
                      </Box>
                      <Button 
                        variant="contained" 
                        color="success" 
                        sx={{ mt: 2 }}
                        startIcon={<Assignment />}
                      >
                        Start Pre-Qualification
                      </Button>
                    </Box>
                  )}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>DRAH Finance Benefits</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <CreditScore sx={{ mr: 1 }} /> Flexible Credit
                </Typography>
                <Typography variant="body2">
                  Minimum FICO score of 500, significantly lower than traditional mortgage requirements.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <AttachMoney sx={{ mr: 1 }} /> No Down Payment
                </Typography>
                <Typography variant="body2">
                  Purchase your property with no down payment required, making homeownership more accessible.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Home sx={{ mr: 1 }} /> No PMI
                </Typography>
                <Typography variant="body2">
                  Save thousands with no Private Mortgage Insurance requirement, regardless of down payment.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DRAHFinanceCalculator;
