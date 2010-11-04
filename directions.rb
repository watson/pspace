#!/usr/bin/ruby
require 'net/http'
require 'rubygems'
require 'json'

observations = JSON.parse(File.read('ppladserkbh1.1.js'));

def uri(start, slut)
  URI.parse(
    'http://maps.googleapis.com/maps/api/directions/json?origin=' +
      start['Lat'].to_s + ',' + start['Lon'].to_s +
     '&destination=' + slut['Lat'].to_s + ',' + slut['Lon'].to_s +
     '&sensor=false&mode=walking'
  )
end

def get_directions(start, slut)
  if start
    # uri(start, slut).to_s
    Net::HTTP.get(uri(start, slut))
  else
    nil
  end
end

# p observations.class

urls = observations[0..3].map do |observation|
  # p observation
  start = observation['StartAdresse']['LngLat']
  slut = observation['SlutAdresse']['LngLat']
  observation['directions'] = get_directions(start, slut)
  observation
end

File.open('ppladser.with_directions.js', 'w') do |f|
  f << urls.to_json
end

puts "Done!"
# p urls.to_json