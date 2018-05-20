#Script calificar proyectos con el modelo de bloques incompletos balanceados
.libPaths(c("C:/Users/brand/Documents/R/win-library/3.4", .libPaths()))
args <- commandArgs(trailingOnly = TRUE)
if(length(args) != 4) {
	stop("Deben de ser 4 parámetros", call.=FALSE)
} 

suppressWarnings(suppressMessages(require(jsonlite)))
suppressWarnings(suppressMessages(require(ibd)))
suppressWarnings(suppressMessages(require(crossdes)))
suppressWarnings(suppressMessages(require(ggplot2)))
suppressWarnings(suppressMessages(require(dplyr)))
suppressWarnings(suppressMessages(require(tidyr)))
suppressWarnings(suppressMessages(require(readr)))
suppressWarnings(suppressMessages(require(emmeans)))
suppressWarnings(suppressMessages(require(nlme)))

#Projects
t <- strtoi(args[1])
#Evaluators
b <- strtoi(args[2])
#ProjectsPerEvaluator
k <- strtoi(args[3])

#Ordenadas por evaluador index y a su vez por proyecto index, así deben ser recibidas
grades <- fromJSON(args[4])

set.seed(1)
bib <- find.BIB(trt = t, b = b, k = k)

bloq <- 1:b
Eval_Proyect <- as.data.frame(bib) %>%
  gather(columna, trt) %>%  ## Unir todas las columnas en una sola columna
  mutate(evaluator_Index = as.factor(rep(bloq,k)),  # Asignar evaluador
         project_Index = as.factor(trt)) %>% # Asignar proyecto a revisar
  select(evaluator_Index, project_Index) %>%  # Extraer solo las columnas mencionadas
  arrange(evaluator_Index) # Ordenar en base al evaluador

Eval_Proyect$Calificacion <- grades
datos <- Eval_Proyect

modelo <- lme(Calificacion~project_Index, random = ~ 1 | evaluator_Index, data = datos)

Ajuste <- emmeans(modelo, ~project_Index)
summ <- summary(Ajuste)

# aov <- anova(modelo)
print(toJSON(summ, pretty = T))