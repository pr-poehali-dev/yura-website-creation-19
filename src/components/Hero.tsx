import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const Hero = () => {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <div className="animate-slide-up">
            <h2 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Технологии будущего
              <br />
              уже сегодня
            </h2>
          </div>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 animate-fade-in">
            Огромный выбор электроники и гаджетов с доставкой по всей России. 
            Официальная гарантия и низкие цены!
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-12 animate-scale-in">
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
              <Icon name="ShoppingBag" className="mr-2 h-5 w-5" />
              Каталог товаров
            </Button>
            <Button size="lg" variant="outline" className="border-2">
              <Icon name="Percent" className="mr-2 h-5 w-5" />
              Акции и скидки
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
            {[
              { icon: 'Truck', title: 'Быстрая доставка', desc: 'От 1 дня' },
              { icon: 'Shield', title: 'Гарантия', desc: 'До 3 лет' },
              { icon: 'CreditCard', title: 'Оплата', desc: 'Любым способом' },
              { icon: 'Headphones', title: 'Поддержка', desc: '24/7' }
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex justify-center mb-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <Icon name={item.icon as any} className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10" />
    </section>
  );
};

export default Hero;
