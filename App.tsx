
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { PortfolioView } from './components/PortfolioView';
import { ServiceDetailView } from './components/ServiceDetailView';
import { QuoterModal } from './components/QuoterModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { MyQuotesView } from './components/MyQuotesView';
import { AddProductModal } from './components/AddProductModal';
import { Footer } from './components/Footer';
import { ServicePlus, Quote, Expert, CaseStudy, SalesDocument } from './types';
import { MOCK_SERVICES, MOCK_EXPERTS, MOCK_CASE_STUDIES, MOCK_SALES_DOCUMENTS } from './services/mockData';

enum View {
  PORTFOLIO,
  SERVICE_DETAIL,
  MY_QUOTES,
}

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.PORTFOLIO);
  const [selectedService, setSelectedService] = useState<ServicePlus | null>(null);
  
  // Modal States
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isQuoterOpen, setIsQuoterOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // Data States
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [quoteToDuplicate, setQuoteToDuplicate] = useState<Quote | null>(null);
  const [services, setServices] = useState<ServicePlus[]>(MOCK_SERVICES);
  const [experts, setExperts] = useState<Expert[]>(MOCK_EXPERTS);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(MOCK_CASE_STUDIES);
  const [salesDocuments, setSalesDocuments] = useState<SalesDocument[]>(MOCK_SALES_DOCUMENTS);

  useEffect(() => {
    try {
      const storedQuotes = localStorage.getItem('gtm-quotes');
      if (storedQuotes) {
        setQuotes(JSON.parse(storedQuotes));
      }
      // In a real app, we would also check localStorage for added services here
    } catch (error) {
      console.error("Error loading quotes from localStorage", error);
    }
  }, []);

  const saveQuotes = (newQuotes: Quote[]) => {
    try {
      localStorage.setItem('gtm-quotes', JSON.stringify(newQuotes));
      setQuotes(newQuotes);
    } catch (error) {
      console.error("Error saving quotes to localStorage", error);
    }
  };

  const handleAddQuote = (quote: Omit<Quote, 'id' | 'createdAt'>) => {
    const newQuote: Quote = {
      ...quote,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    saveQuotes([newQuote, ...quotes]);
  };

  const handleSelectService = useCallback((service: ServicePlus) => {
    setSelectedService(service);
    setView(View.SERVICE_DETAIL);
  }, []);

  const handleBackToPortfolio = useCallback(() => {
    setSelectedService(null);
    setView(View.PORTFOLIO);
  }, []);

  const handleNavigate = (targetView: 'portfolio' | 'my_quotes') => {
    if (targetView === 'portfolio') {
      setView(View.PORTFOLIO);
      setSelectedService(null);
    } else {
      setView(View.MY_QUOTES);
      setSelectedService(null);
    }
  };
  
  const handleOpenQuoterRequest = useCallback(() => {
    setIsConfirmationOpen(true);
  }, []);

  const handleConfirmAndOpenQuoter = useCallback(() => {
    setIsConfirmationOpen(false);
    setIsQuoterOpen(true);
  }, []);

  const handleCloseQuoter = useCallback(() => {
    setIsQuoterOpen(false);
    setQuoteToDuplicate(null);
  }, []);

  const handleDuplicateQuote = useCallback((quote: Quote) => {
    const service = services.find(s => s.id === quote.serviceId);
    if(service) {
        setSelectedService(service);
        setQuoteToDuplicate(quote);
        setIsQuoterOpen(true);
    } else {
        alert("El servicio asociado a esta cotización ya no existe.");
    }
  }, [services]);

  const handleAddProduct = (newService: ServicePlus, newExpert: Expert | null, newCaseStudy: CaseStudy | null, newDocuments: SalesDocument[]) => {
    setServices(prev => [newService, ...prev]);
    if (newExpert) {
        setExperts(prev => [...prev, newExpert]);
    }
    if (newCaseStudy) {
        setCaseStudies(prev => [...prev, newCaseStudy]);
    }
    if (newDocuments.length > 0) {
        setSalesDocuments(prev => [...prev, ...newDocuments]);
    }
    
    // Navigate to the new service
    setSelectedService(newService);
    setView(View.SERVICE_DETAIL);
  };


  const renderContent = () => {
    switch(view) {
      case View.SERVICE_DETAIL:
        if (!selectedService) return null;
        
        const serviceExperts = experts.filter(e => e.serviceId === selectedService.id);
        const serviceCases = caseStudies.filter(c => c.serviceId === selectedService.id);
        const serviceDocs = salesDocuments.filter(d => d.serviceId === selectedService.id);

        return (
          <ServiceDetailView
            service={selectedService}
            relatedDocuments={serviceDocs}
            relatedCaseStudies={serviceCases}
            relatedExperts={serviceExperts}
            onBack={handleBackToPortfolio}
            onGenerateQuote={handleOpenQuoterRequest}
          />
        );
      case View.MY_QUOTES:
        return <MyQuotesView quotes={quotes} onDuplicate={handleDuplicateQuote} onSelectService={handleSelectService} />;
      case View.PORTFOLIO:
      default:
        return <PortfolioView services={services} onSelectService={handleSelectService} quotes={quotes} />;
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Header onNavigate={handleNavigate} onAddProduct={() => setIsAddProductOpen(true)} />
      <main className="p-4 sm:p-6 md:p-8 flex-grow">
        {renderContent()}
      </main>
      <Footer />
      
      {isConfirmationOpen && (
        <ConfirmationModal
          onClose={() => setIsConfirmationOpen(false)}
          onConfirm={handleConfirmAndOpenQuoter}
        />
      )}

      {isQuoterOpen && selectedService && (
        <QuoterModal
          service={selectedService}
          onClose={handleCloseQuoter}
          onSaveQuote={handleAddQuote}
          initialQuote={quoteToDuplicate}
        />
      )}

      {isAddProductOpen && (
        <AddProductModal 
            onClose={() => setIsAddProductOpen(false)}
            onSave={handleAddProduct}
        />
      )}
    </div>
  );
};

export default App;
