import { Users, Trophy, Heart } from "lucide-react";

export function FeaturesSection() {
  return (
    <section className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            Why Choose Our VO2Max Program?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20 group-hover:shadow-lg">
                <Users className="w-8 h-8 text-primary transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors duration-300">
                Science-Backed
              </h3>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                Our plans are based on peer-reviewed research and proven
                training methodologies used by elite athletes and sports
                scientists worldwide.
              </p>
            </div>

            <div className="text-center group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20 group-hover:shadow-lg">
                <Trophy className="w-8 h-8 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors duration-300">
                Personalized
              </h3>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                Every plan is tailored to your age, current fitness level, and
                goals. Get three different intensity options to match your
                lifestyle.
              </p>
            </div>

            <div className="text-center group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20 group-hover:shadow-lg">
                <Heart className="w-8 h-8 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors duration-300">
                Proven Results
              </h3>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                Track measurable improvements in your cardiovascular health,
                endurance, and overall fitness with realistic timelines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
