import React, { useState } from 'react';
import { Header } from './components/Header';
import { PromptCard } from './components/PromptCard';
import { generatePrompts } from './services/geminiService';
import { ProductData, GeneratedPrompt, TargetModel, ProductType } from './types';
import { Sparkles, Loader2, ShoppingBag, Tag, AlertCircle, MapPin, Shirt, Box } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [prompts, setPrompts] = useState<GeneratedPrompt[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [productName, setProductName] = useState('');
  const [features, setFeatures] = useState('');
  const [price, setPrice] = useState('');
  const [hasPrice, setHasPrice] = useState(false);
  const [targetModel, setTargetModel] = useState<TargetModel>(TargetModel.VEO3);
  const [productType, setProductType] = useState<ProductType>(ProductType.PHYSICAL);
  const [environment, setEnvironment] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName || !features || !environment) {
      setError("Por favor, preencha o nome, características e o ambiente.");
      return;
    }

    setLoading(true);
    setError(null);
    setPrompts([]);

    const data: ProductData = {
      productName,
      features,
      price,
      hasPrice,
      targetModel,
      productType,
      environment
    };

    try {
      const response = await generatePrompts(data);
      setPrompts(response.prompts);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col pb-20 font-sans">
      <Header />

      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Section */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <ShoppingBag className="text-orange-500" size={20} />
              <h2 className="text-lg font-bold text-slate-800">Configuração do Vídeo</h2>
            </div>
            
            <form onSubmit={handleGenerate} className="space-y-5">
              
              {/* Type Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Tipo de Produto</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setProductType(ProductType.PHYSICAL)}
                    className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      productType === ProductType.PHYSICAL
                        ? 'bg-orange-50 border-orange-400 text-orange-700 ring-1 ring-orange-400'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <Box size={18} />
                    <span className="text-xs font-bold">Objeto Físico</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductType(ProductType.FASHION)}
                    className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      productType === ProductType.FASHION
                        ? 'bg-pink-50 border-pink-400 text-pink-700 ring-1 ring-pink-400'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <Shirt size={18} />
                    <span className="text-xs font-bold">Moda/Roupa</span>
                  </button>
                </div>
              </div>

              {/* Environment */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Ambiente / Cenário</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all text-sm"
                    placeholder="Ex: Praia, Quarto Gamer, Cozinha Luxuosa"
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value)}
                  />
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Product Details */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Produto</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all text-sm mb-3"
                  placeholder="Nome do Produto"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
                <textarea
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all text-sm h-28 resize-none"
                  placeholder="Características: Cor, material, benefícios, para que serve..."
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                />
              </div>

              {/* Price */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <Tag size={14} /> Informar Preço?
                  </label>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input 
                      type="checkbox" 
                      name="toggle" 
                      id="toggle" 
                      checked={hasPrice}
                      onChange={(e) => setHasPrice(e.target.checked)}
                      className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      style={{ right: hasPrice ? '0' : 'auto', left: hasPrice ? 'auto' : '0', borderColor: hasPrice ? '#f97316' : '#cbd5e1' }}
                    />
                    <label htmlFor="toggle" className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${hasPrice ? 'bg-orange-400' : 'bg-slate-300'}`}></label>
                  </div>
                </div>
                
                {hasPrice && (
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded border border-slate-300 text-sm animate-fadeIn"
                    placeholder="Ex: R$ 49,90"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                )}
              </div>

              {/* Model Selection (Hidden primarily since prompt is universal, but kept for logic) */}
              <div className="hidden">
                 <button onClick={() => setTargetModel(TargetModel.VEO3)}>Veo3</button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-slate-900/20 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={22} />
                    <span>Criando Roteiros...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={22} className="text-yellow-400" />
                    <span>Gerar Prompts Mágicos</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* Results Section */}
        <section className="lg:col-span-8 space-y-6">
           {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {!loading && prompts.length === 0 && !error && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-slate-400 p-12 border-2 border-dashed border-slate-200 rounded-3xl bg-white">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                <Sparkles size={40} className="text-orange-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-600 mb-2">Pronto para criar?</h3>
              <p className="text-center text-slate-500 max-w-md">
                Preencha os detalhes do produto e ambiente ao lado para gerar prompts otimizados para o Veo3 com a estrutura <b>@achadinhos_da_ellen</b>.
              </p>
            </div>
          )}

          {loading && (
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-8 h-96 animate-pulse shadow-sm border border-slate-100">
                  <div className="h-6 bg-slate-200 rounded w-1/4 mb-8"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                    <div className="h-20 bg-slate-100 rounded w-full mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 gap-8">
            {prompts.map((prompt, index) => (
              <PromptCard key={index} prompt={prompt} index={index} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;