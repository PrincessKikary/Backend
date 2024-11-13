export const typeDefs = `#graphql
type Family {
    id:ID!
    name: String!
    members: [Person!]!
}
type Person {
    id:ID!
    name:String!
    age:Int
    family: Family!
    relationships: [Relationship!]!
}

enum RelationshipType {
    PARENT_CHILD
    SPOUSE
    SIBLING
}

type Relationship {
    id:ID!
    type:RelationshipType!
    person:Person!
}

type Query{
    family:[Family]!
    person:[Person]!
    relationship:[Relationship]!
}

`
  