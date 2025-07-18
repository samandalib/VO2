import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  ArrowRight,
  Activity,
  BarChart3,
  TrendingUp,
  FlaskConical,
  Target,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "@/contexts/SupabaseAuthContext";

interface HeroSectionProps {
  onStartAssessment: () => void;
  onNavigateToDashboard: () => void;
  onShowProjectionCalculator: () => void;
  onShowTestingProtocols: () => void;
  onSignIn?: () => void;
}

export function HeroSection({
  onStartAssessment,
  onNavigateToDashboard,
  onShowProjectionCalculator,
  onShowTestingProtocols,
  onSignIn,
}: HeroSectionProps) {
  const { user, signOut } = useAuth();
  const features = [
    {
      icon: BarChart3,
      title: "Dashboard",
      description: "Track your VO₂max progress and training metrics",
      onClick: onNavigateToDashboard,
      color: "text-primary",
      bgColor: "bg-primary/10",
      hoverColor: "hover:bg-primary/20",
    },
    {
      icon: TrendingUp,
      title: "VO₂Max Projection",
      description: "Calculate your future cardiovascular fitness trajectory",
      onClick: onShowProjectionCalculator,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100 dark:bg-emerald-950/30",
      hoverColor: "hover:bg-emerald-200 dark:hover:bg-emerald-900/40",
    },
    {
      icon: Target,
      title: "Training Protocols",
      description: "Get personalized, science-backed training plans",
      onClick: onStartAssessment,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      hoverColor: "hover:bg-purple-200",
    },
    {
      icon: FlaskConical,
      title: "Testing Protocols",
      description: "Learn about VO₂max measurement techniques",
      onClick: onShowTestingProtocols,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      hoverColor: "hover:bg-orange-200",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-primary/10">
      {/* Header with Theme Toggle and Auth Button */}
      <div className="absolute top-0 right-0 p-6 z-50 flex items-center gap-3">
        <ThemeToggle />
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-2 rounded-md">
              <User className="w-4 h-4" />
              <span className="font-mono">{user.email}</span>
            </div>
            <Button
              onClick={() => {
                console.log("HeroSection: Sign out button clicked");
                signOut();
              }}
              variant="outline"
              className="bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-300 cursor-pointer relative z-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        ) : (
          onSignIn && (
            <Button
              onClick={onSignIn}
              variant="outline"
              className="bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-300"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          )
        )}
      </div>
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          {/* Two-column layout: Hero text on left, Feature tiles on right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Hero Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-8 animate-pulse hover:animate-none transition-all duration-300 hover:scale-110 hover:bg-primary/20 group">
                <Activity className="w-10 h-10 text-primary transition-transform duration-300 group-hover:rotate-12" />
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700">
                Unlock Your
                <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  {" "}
                  VO<sub style={{ color: "rgb(35, 160, 76)" }}>2</sub>Max
                </span>
                <br />
                Potential
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-2xl lg:max-w-none leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                {user ? (
                  <>
                    Welcome back! Continue your cardiovascular fitness journey
                    with personalized, science-backed training plans that adapt
                    to your progress.
                  </>
                ) : (
                  <>
                    Get personalized, science-backed training plans to improve
                    your cardiovascular fitness. Our evidence-based approach
                    adapts to your current fitness level and goals.
                  </>
                )}
              </p>

              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 flex flex-col justify-center items-center">
                {user ? (
                  <Button
                    onClick={onNavigateToDashboard}
                    className="text-lg px-8 py-6 h-auto rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 group relative overflow-hidden"
                  >
                    <span className="relative z-10">Go to Dashboard</span>
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Sign in to see your training dashboard
                    </p>
                    <Button
                      onClick={onStartAssessment}
                      className="text-lg px-8 py-6 h-auto rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 group relative overflow-hidden"
                    >
                      <span className="relative z-10">Start training</span>
                      <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Feature Tiles in 2x2 Grid */}
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700">
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <Card
                      key={feature.title}
                      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-primary/20 aspect-square"
                      onClick={feature.onClick}
                    >
                      <CardContent className="p-4 text-center h-full flex flex-col justify-center items-center">
                        <div
                          className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3 transition-colors duration-300 ${feature.bgColor} ${feature.hoverColor}`}
                        >
                          <IconComponent
                            className={`w-5 h-5 ${feature.color}`}
                          />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
    </section>
  );
}
