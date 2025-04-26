import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  Stepper,
  Step,
  StepLabel,
  Box,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import { 
  Assignment, 
  AttachMoney, 
  CreditScore, 
  Home, 
  Work,
  AccountBalance,
  CheckCircle
} from '@mui/icons-material';

const DRAHFinanceApplication = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState(null);
  const [applicationData, setApplicationData] = useState({
    userId: '123456789', // This would come from auth context in a real app
    propertyId: propertyId || '',
    ficoScore: 600,
    loanAmount: 150000,
    loanTerm: 30,
    income: {
      annual: 60000,
      source: 'Employment',
    },
    employmentInfo: {
      employer: '',
      position: '',
      yearsEmployed: 0
    },
    loanType: 'standard', // standard, construction, rehabilitation
    agreeToTerms: false
  });
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [applicationResult, setApplicationResult] = useState(null);
  
  // Fetch property details if propertyId is provided
  useEffect(() => {
    if (propertyId) {
      // This would be an API call in a real application
      setLoading(true);
      setTimeout(() => {
        setProperty({
          id: propertyId,
          title: 'Vacant Lot in St. Bernard Parish',
          address: '123 Main St, St. Bernard Parish, LA 70032',
          price: 45000,
          type: 'vacant_lot',
          size: {
            value: 7500,
            unit: 'sq_ft'
          },
          image: 'https://example.com/property.jpg'
        });
        setApplicationData(prev => ({
          ...prev,
          propertyId,
          loanAmount: 45000
        }));
        setLoading(false);
      }, 1000);
    }
  }, [propertyId]);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setApplicationData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setApplicationData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setApplicationData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const checkEligibility = () => {
    setLoading(true);
    
    // This would be an API call in a real application
    setTimeout(() => {
      const { ficoScore, income, loanAmount } = applicationData;
      
      if (ficoScore < 500) {
        setEligibilityResult({
          eligible: false,
          reason: 'FICO score below minimum requirement of 500'
        });
      } else {
        // Simple debt-to-income ratio check
        const monthlyIncome = income.annual / 12;
        const estimatedMonthlyPayment = loanAmount * 0.006; // Rough estimate
        const dti = (estimatedMonthlyPayment / monthlyIncome) * 100;
        
        if (dti > 43) {
          setEligibilityResult({
            eligible: false,
            reason: 'Debt-to-income ratio too high'
          });
        } else {
          // Calculate interest rate based on FICO score
          let interestRate;
          if (ficoScore >= 700) {
            interestRate = 3.5;
          } else if (ficoScore >= 650) {
            interestRate = 4.0;
          } else if (ficoScore >= 600) {
            interestRate = 4.5;
          } else if (ficoScore >= 550) {
            interestRate = 5.0;
          } else {
            interestRate = 5.5;
          }
          
          // Calculate monthly payment
          const principal = loanAmount;
          const monthlyRate = interestRate / 100 / 12;
          const numberOfPayments = applicationData.loanTerm * 12;
          const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
          
          setEligibilityResult({
            eligible: true,
            reason: 'Meets basic eligibility requirements',
            interestRate,
            monthlyPayment: payment.toFixed(2),
            totalPayment: (payment * numberOfPayments).toFixed(2),
            totalInterest: ((payment * numberOfPayments) - principal).toFixed(2)
          });
        }
      }
      
      setLoading(false);
    }, 1500);
  };
  
  const submitPreQualification = () => {
    setLoading(true);
    
    // This would be an API call in a real application
    setTimeout(() => {
      setApplicationResult({
        success: true,
        applicationId: `DRAH-${Date.now()}`,
        status: 'pre_qualification',
        message: 'Pre-qualification application submitted successfully',
        nextSteps: [
          'Submit required documentation',
          'Complete full application',
          'Await underwriting decision'
        ]
      });
      
      setLoading(false);
      setActiveStep(3); // Move to confirmation step
    }, 2000);
  };
  
  const handleNext = () => {
    if (activeStep === 0) {
      checkEligibility();
    }
    
    if (activeStep === 1 && !eligibilityResult?.eligible) {
      return; // Don't proceed if not eligible
    }
    
    if (activeStep === 2) {
      submitPreQualification();
      return;
    }
    
    setActiveStep(prevStep => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };
  
  const steps = ['Basic Information', 'Eligibility Check', 'Application Details', 'Confirmation'];
  
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Loan Information</Typography>
            </Grid>
            
            {property && (
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>Selected Property</Typography>
                    <Typography variant="body1">{property.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{property.address}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {property.size.value} {property.size.unit} • ${property.price.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Loan Amount"
                name="loanAmount"
                type="number"
                value={applicationData.loanAmount}
                onChange={handleInputChange}
                fullWidth
                required
                InputProps={{ startAdornment: '$' }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Loan Term</InputLabel>
                <Select
                  name="loanTerm"
                  value={applicationData.loanTerm}
                  onChange={handleInputChange}
                  label="Loan Term"
                >
                  <MenuItem value={15}>15 Years</MenuItem>
                  <MenuItem value={20}>20 Years</MenuItem>
                  <MenuItem value={30}>30 Years</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Loan Type</InputLabel>
                <Select
                  name="loanType"
                  value={applicationData.loanType}
                  onChange={handleInputChange}
                  label="Loan Type"
                >
                  <MenuItem value="standard">Standard DRAH Mortgage</MenuItem>
                  <MenuItem value="construction">Construction-to-Permanent Loan</MenuItem>
                  <MenuItem value="rehabilitation">Rehabilitation Loan</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="FICO Score"
                name="ficoScore"
                type="number"
                value={applicationData.ficoScore}
                onChange={handleInputChange}
                fullWidth
                required
                helperText="Minimum score: 500"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Income Information</Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Annual Income"
                name="income.annual"
                type="number"
                value={applicationData.income.annual}
                onChange={handleInputChange}
                fullWidth
                required
                InputProps={{ startAdornment: '$' }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Income Source</InputLabel>
                <Select
                  name="income.source"
                  value={applicationData.income.source}
                  onChange={handleInputChange}
                  label="Income Source"
                >
                  <MenuItem value="Employment">Employment</MenuItem>
                  <MenuItem value="Self-Employment">Self-Employment</MenuItem>
                  <MenuItem value="Retirement">Retirement</MenuItem>
                  <MenuItem value="Investments">Investments</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Eligibility Results</Typography>
            </Grid>
            
            {loading ? (
              <Grid item xs={12} sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Checking eligibility...
                </Typography>
              </Grid>
            ) : eligibilityResult ? (
              <>
                <Grid item xs={12}>
                  <Alert severity={eligibilityResult.eligible ? "success" : "error"}>
                    {eligibilityResult.reason}
                  </Alert>
                </Grid>
                
                {eligibilityResult.eligible && (
                  <>
                    <Grid item xs={12}>
                      <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText', mb: 2 }}>
                        <CardContent>
                          <Typography variant="h5" gutterBottom>
                            ${Number(eligibilityResult.monthlyPayment).toLocaleString()}
                          </Typography>
                          <Typography variant="subtitle2">
                            Estimated Monthly Payment
                          </Typography>
                        </CardContent>
                      </Card>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Loan Amount:</Typography>
                          <Typography variant="body1">${Number(applicationData.loanAmount).toLocaleString()}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Loan Term:</Typography>
                          <Typography variant="body1">{applicationData.loanTerm} years</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Interest Rate:</Typography>
                          <Typography variant="body1">{eligibilityResult.interestRate}%</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Total Interest:</Typography>
                          <Typography variant="body1">${Number(eligibilityResult.totalInterest).toLocaleString()}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">Total Payment:</Typography>
                          <Typography variant="body1">${Number(eligibilityResult.totalPayment).toLocaleString()}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>DRAH Finance Benefits</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Chip icon={<CheckCircle />} label="No PMI Required" color="success" />
                        <Chip icon={<CheckCircle />} label="No Down Payment" color="success" />
                        <Chip icon={<CheckCircle />} label="Fixed Interest Rate" color="success" />
                        <Chip icon={<CheckCircle />} label="Minimum FICO Score 500" color="success" />
                      </Box>
                    </Grid>
                  </>
                )}
              </>
            ) : (
              <Grid item xs={12}>
                <Alert severity="info">
                  Please complete the basic information to check eligibility.
                </Alert>
              </Grid>
            )}
          </Grid>
        );
      
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Employment Information</Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Employer Name"
                name="employmentInfo.employer"
                value={applicationData.employmentInfo.employer}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Position/Title"
                name="employmentInfo.position"
                value={applicationData.employmentInfo.position}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Years Employed"
                name="employmentInfo.yearsEmployed"
                type="number"
                value={applicationData.employmentInfo.yearsEmployed}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography va
(Content truncated due to size limit. Use line ranges to read in chunks)