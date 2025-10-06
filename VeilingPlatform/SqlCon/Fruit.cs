using System;

namespace sql
{
    public class Fruit
    {
        public int Id { get; }
        public string Naam { get; }
        public string Kleur { get; }
        public decimal Gewicht { get; }
        public int Zoetheid { get; }
        public Fruit(int id, string naam, string kleur, decimal gewicht, int zoetheid)
        {
            Id = id;
            Naam = naam;
            Kleur = kleur;
            Gewicht = gewicht;
            Zoetheid = zoetheid;
        }
    }
}