import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ExternalLink,
  Users,
  Building,
  MapPin,
  Calendar,
} from "lucide-react";

interface TrainingProtocolsSectionProps {
  onStartAssessment: () => void;
}

export function TrainingProtocolsSection({
  onStartAssessment,
}: TrainingProtocolsSectionProps) {
  const navigate = useNavigate();
  return (
    <section className="py-20 bg-secondary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
              Science-backed VO2Max Training Protocols
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Proven research studies demonstrating effective methods for
              improving VO2Max across different populations and training
              approaches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tabata Protocol Study */}
            <div className="bg-card rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-105 group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              <div className="space-y-6">
                {/* Protocol Name - Main Heading */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-primary mb-4">
                    Tabata Protocol
                  </h3>
                </div>

                {/* Main Data */}
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      VO2max Gain
                    </span>
                    <p className="text-lg font-bold text-green-600">
                      ~13% improvement
                    </p>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">
                      Time to Results
                    </span>
                    <p className="text-lg font-semibold">3–6 weeks</p>
                  </div>

                  <div className="mt-4">
                    <span className="text-sm text-muted-foreground">
                      Protocol Duration
                    </span>
                    <p className="text-lg font-bold">
                      7–8 sets of 20s work + 10s rest, ~4 mins/session
                    </p>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">
                      Fitness Level
                    </span>
                    <p className="text-lg font-semibold">Athlete</p>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">
                      Sport Modality
                    </span>
                    <p className="text-lg font-semibold">Cycling (ergometer)</p>
                  </div>

                  <div className="mt-4">
                    <span className="text-sm text-muted-foreground">
                      Research Population
                    </span>
                    <p className="text-lg font-semibold">
                      Young male physical education students (active athletes in
                      university teams)
                    </p>
                  </div>
                </div>

                {/* Reference Button */}
                <Button
                  asChild
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                  variant="outline"
                >
                  <a
                    href="https://doi.org/10.1097/00005768-199610000-00018"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Reference
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>

                {/* Meta Data */}
                <div className="pt-4 border-t border-border/50 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>Izumi Tabata et al.</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Building className="w-3 h-3" />
                    <span>National Institute of Fitness and Sports</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>Japan</span>
                    <Calendar className="w-3 h-3 ml-2" />
                    <span>1996</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Norwegian 4x4 Interval Training */}
            <div className="bg-card rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-105 group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              <div className="space-y-6">
                {/* Protocol Name - Main Heading */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-primary mb-4">
                    Norwegian 4x4 Interval Training
                  </h3>
                </div>

                {/* Main Data */}
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      VO2max Gain
                    </span>
                    <p className="text-lg font-bold text-green-600">~7.2%</p>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">
                      Time to Results
                    </span>
                    <p className="text-lg font-semibold">8 weeks</p>
                  </div>

                  <div className="mt-4">
                    <span className="text-sm text-muted-foreground">
                      Protocol Duration
                    </span>
                    <p className="text-lg font-bold">
                      4 intervals of 4 min at 90–95% HRmax + 3 min rest (~40
                      mins total)
                    </p>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">
                      Fitness Level
                    </span>
                    <p className="text-lg font-semibold">Moderately trained</p>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">
                      Sport Modality
                    </span>
                    <p className="text-lg font-semibold">Running (treadmill)</p>
                  </div>

                  <div className="mt-4">
                    <span className="text-sm text-muted-foreground">
                      Research Population
                    </span>
                    <p className="text-lg font-semibold">
                      Moderately trained healthy men, avg. age 24.6 yrs
                    </p>
                  </div>
                </div>

                {/* Reference Button */}
                <Button
                  asChild
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                  variant="outline"
                >
                  <a
                    href="https://doi.org/10.1249/mss.0b013e3180304570"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Reference
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>

                {/* Meta Data */}
                <div className="pt-4 border-t border-border/50 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>Jan Helgerud et al.</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Building className="w-3 h-3" />
                    <span>Norwegian University of Science and Technology</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>Norway</span>
                    <Calendar className="w-3 h-3 ml-2" />
                    <span>2007</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 10-20-30 Protocol */}
            <div className="bg-card rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-105 group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <div className="space-y-6">
                {/* Protocol Name - Main Heading */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-primary mb-4">
                    10-20-30 Protocol
                  </h3>
                </div>

                {/* Main Data */}
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      VO2max Gain
                    </span>
                    <p className="text-lg font-bold text-green-600">
                      ~13% improvement
                    </p>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">
                      Time to Results
                    </span>
                    <p className="text-lg font-semibold">7–8 weeks</p>
                  </div>

                  <div className="mt-4">
                    <span className="text-sm text-muted-foreground">
                      Protocol Duration
                    </span>
                    <p className="text-lg font-bold">
                      Running: 30s low, 20s moderate, 10s sprint x 5 reps/set x
                      3 sets
                    </p>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">
                      Fitness Level
                    </span>
                    <p className="text-lg font-semibold">
                      Amateur to Recreational Athlete
                    </p>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">
                      Sport Modality
                    </span>
                    <p className="text-lg font-semibold">Running</p>
                  </div>

                  <div className="mt-4">
                    <span className="text-sm text-muted-foreground">
                      Research Population
                    </span>
                    <p className="text-lg font-semibold">
                      Moderately trained runners (avg. age ~41 yrs, male/female)
                    </p>
                  </div>
                </div>

                {/* Reference Button */}
                <Button
                  asChild
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                  variant="outline"
                >
                  <a
                    href="https://doi.org/10.1152/japplphysiol.00334.2012"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Reference
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>

                {/* Meta Data */}
                <div className="pt-4 border-t border-border/50 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>Thomas Gunnarsson, Jens Bangsbo</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Building className="w-3 h-3" />
                    <span>University of Copenhagen</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>Denmark</span>
                    <Calendar className="w-3 h-3 ml-2" />
                    <span>2012</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Billat's 30:30 */}
            <div className="bg-card rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-105 group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
              <div className="space-y-6">
                {/* Protocol Name - Main Heading */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-primary mb-4">
                    Billat's 30:30
                  </h3>
                </div>

                {/* Main Data */}
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      VO2max Gain
                    </span>
                    <p className="text-lg font-bold text-green-600">
                      Not quantified directly but improves max velocity and
                      endurance
                    </p>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">
                      Time to Results
                    </span>
                    <p className="text-lg font-semibold">4–6 weeks</p>
                  </div>

                  <div className="mt-4">
                    <span className="text-sm text-muted-foreground">
                      Protocol Duration
                    </span>
                    <p className="text-lg font-bold">
                      30s at 100% vVO2max, 30s jog, repeated ~12–20 mins
                    </p>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">
                      Fitness Level
                    </span>
                    <p className="text-lg font-semibold">Advanced to Athlete</p>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">
                      Sport Modality
                    </span>
                    <p className="text-lg font-semibold">Running</p>
                  </div>

                  <div className="mt-4">
                    <span className="text-sm text-muted-foreground">
                      Research Population
                    </span>
                    <p className="text-lg font-semibold">
                      Well-trained middle and long-distance runners
                    </p>
                  </div>
                </div>

                {/* Reference Button */}
                <Button
                  asChild
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                  variant="outline"
                >
                  <a
                    href="https://doi.org/10.2165/00007256-200131020-00001"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Reference
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>

                {/* Meta Data */}
                <div className="pt-4 border-t border-border/50 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>Veronique Billat</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Building className="w-3 h-3" />
                    <span>University of Evry-Val-d'Essonne</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>France</span>
                    <Calendar className="w-3 h-3 ml-2" />
                    <span>1999</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lactate Threshold Training */}
            <div className="bg-card rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-105 group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
              <div className="space-y-6">
                {/* Protocol Name - Main Heading */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-primary mb-4">
                    Lactate Threshold Training
                  </h3>
                </div>

                {/* Main Data */}
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      VO2max Gain
                    </span>
                    <p className="text-lg font-bold text-green-600">
                      Modest, typically 3–5%
                    </p>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">
                      Time to Results
                    </span>
                    <p className="text-lg font-semibold">~3–6 weeks</p>
                  </div>

                  <div className="mt-4">
                    <span className="text-sm text-muted-foreground">
                      Protocol Duration
                    </span>
                    <p className="text-lg font-bold">~30 mins per session</p>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">
                      Fitness Level
                    </span>
                    <p className="text-lg font-semibold">Amateur to Athlete</p>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">
                      Sport Modality
                    </span>
                    <p className="text-lg font-semibold">Treadmill Running</p>
                  </div>

                  <div className="mt-4">
                    <span className="text-sm text-muted-foreground">
                      Research Population
                    </span>
                    <p className="text-lg font-semibold">
                      Healthy males (age ~22)
                    </p>
                  </div>
                </div>

                {/* Reference Button */}
                <Button
                  asChild
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                  variant="outline"
                >
                  <a
                    href="https://doi.org/10.1152/jappl.2000.89.5.1744"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Reference
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>

                {/* Meta Data */}
                <div className="pt-4 border-t border-border/50 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>Hamish Carter et al.</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Building className="w-3 h-3" />
                    <span>University of Brighton</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>UK</span>
                    <Calendar className="w-3 h-3 ml-2" />
                    <span>2000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Zone 2 Training */}
            <div className="bg-card rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-105 group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-600">
              <div className="space-y-6">
                {/* Protocol Name - Main Heading */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-primary mb-4">
                    Zone 2 Training
                  </h3>
                </div>

                {/* Main Data */}
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      VO2max Gain
                    </span>
                    <p className="text-lg font-bold text-green-600">
                      Gradual; 3–7% depending on baseline
                    </p>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">
                      Time to Results
                    </span>
                    <p className="text-lg font-semibold">8–12 weeks</p>
                  </div>

                  <div className="mt-4">
                    <span className="text-sm text-muted-foreground">
                      Protocol Duration
                    </span>
                    <p className="text-lg font-bold">45–90 mins/session</p>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">
                      Fitness Level
                    </span>
                    <p className="text-lg font-semibold">All levels</p>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">
                      Sport Modality
                    </span>
                    <p className="text-lg font-semibold">
                      Running, Cycling, Endurance Modalities
                    </p>
                  </div>

                  <div className="mt-4">
                    <span className="text-sm text-muted-foreground">
                      Research Population
                    </span>
                    <p className="text-lg font-semibold">Endurance athletes</p>
                  </div>
                </div>

                {/* Reference Button */}
                <Button
                  asChild
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                  variant="outline"
                >
                  <a
                    href="https://doi.org/10.1123/ijspp.5.3.276"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Reference
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>

                {/* Meta Data */}
                <div className="pt-4 border-t border-border/50 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>Stephen Seiler</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Building className="w-3 h-3" />
                    <span>University of Agder</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>Norway</span>
                    <Calendar className="w-3 h-3 ml-2" />
                    <span>2010</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700">
            <p className="text-sm text-muted-foreground mb-4">
              These research studies form the foundation of evidence-based
              training protocols that inform our personalized recommendations.
            </p>
            <Button
              onClick={() => navigate("/protocols")}
              className="group hover:shadow-lg transition-all duration-300"
            >
              Pick the VO₂Max training protocol that works for you
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
