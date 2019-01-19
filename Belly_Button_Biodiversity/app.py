import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

#app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/bellybutton.sqlite"
#db = SQLAlchemy(app)

#####Engine****
engine=create_engine("sqlite:///DataSets/belly_button_biodiversity.sqlite")
session=Session(bind=engine)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table

Metadata= Base.classes.samples_metadata
Samples = Base.classes.samples
OTU = Base.classes.otu

@app.route("/")
def home():
 #   """Return the homepage."""
    return render_template("index.html")


@app.route("/names")
def names():
 #   """Return a list of sample names."""

    # Use Pandas to perform the sql query
    samples_query = session.query(Samples)
    samples = pd.read_sql(samples_query.statement, samples_query.session.bind)
    names=list()
    for i in samples.to_dict().keys():
        names.append(i)

    # Return a list of the column names (sample names)
    ##return jsonify(list(df.columns)[2:])
    names=names[1:]
    return(jsonify(names))

@app.route("/metadata/<sample>")
def metadata(sample):
    sampleID=int(sample.split("_")[1])
    metadata_query = session.query(Metadata).filter(Metadata.SAMPLEID==sampleID)
    metadata = pd.read_sql(metadata_query.statement, metadata_query.session.bind)
    return(jsonify(metadata.to_dict()))   

@app.route("/wfreq/<sample>")
def wfreq(sample):
    sampleID=int(sample.split("_")[1])
    wfreq_query = session.query(Metadata).filter(Metadata.SAMPLEID==sampleID)
    wfreq = int(pd.read_sql(wfreq_query.statement, wfreq_query.session.bind)['WFREQ'])
    return(jsonify(wfreq))


@app.route("/otu")
def otu():
    otu_query = session.query(OTU)
    otu = pd.read_sql(otu_query.statement, otu_query.session.bind)
    descriptions=otu.lowest_taxonomic_unit_found
    return(jsonify(descriptions.to_dict()))  

    #results = db.session.query(*sel).filter(Samples_Metadata.sample == sample).all()

    # Create a dictionary entry for each row of metadata information
    #sample_metadata = {}
    #for result in results:
    #    sample_metadata["sample"] = result[0]
    #    sample_metadata["ETHNICITY"] = result[1]
    #    sample_metadata["GENDER"] = result[2]
    #    sample_metadata["AGE"] = result[3]
    #    sample_metadata["LOCATION"] = result[4]
    #    sample_metadata["BBTYPE"] = result[5]
    #    sample_metadata["WFREQ"] = result[6]

    ##print(sample_metadata)
    ##return jsonify(sample_metadata)


@app.route("/samples/<sample>")
def samples(sample):
    """Return `otu_ids`, `otu_labels`,and `sample_values`."""
    samples_query = session.query(Samples)
    all_samples = pd.read_sql(samples_query.statement, samples_query.session.bind)

    # Filter the data based on the sample number and
    # only keep rows with values above 1
    data=all_samples[['otu_id',sample]]
    data=data.loc[data[sample]>0]
    data.columns=['otu_id','samples']
    data=data.sort_values('samples',ascending=False)
    otu_ids=[]
    samples=[]
    for i in range(0,len(data)):
        otu_ids.append(str(data['otu_id'].iloc[i]))
        samples.append(str(data['samples'].iloc[i]))

    # Format the data to send as json
    newdict={
        "otu_id":otu_ids,
        "samples":samples
    }

    return(jsonify(newdict))


#if __name__ == "__main__":
#    app.run()
#    raise NotImplementedError()